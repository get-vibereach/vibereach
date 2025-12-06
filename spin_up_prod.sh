#!/bin/bash
set -e

# Helper for colored output
print_status() {
    local status="$1"
    local message="$2"
    local color

    case "$status" in
        info)
            color="\033[38;2;97;170;242m" ;;   # Blue
        success)
            color="\033[32m" ;;   # Green
        error)
            color="\033[31m" ;;   # Red
        *)
            color="\033[0m" ;;
    esac

    echo -e "${color}${message}\033[0m"
}

# Prompt user for slot and commit hash
read -p "Enter the slot to use for production (blue/green): " SLOT
if [ "$SLOT" != "blue" ] && [ "$SLOT" != "green" ]; then
    print_status error "Invalid slot. Please choose 'blue' or 'green'."
    exit 1
fi

read -p "Enter the commit hash to deploy: " COMMIT_HASH
if [ -z "$COMMIT_HASH" ]; then
    print_status error "Commit hash cannot be empty."
    exit 1
fi

read -p "Enter the port to deploy: " PORT
if [ -z "$PORT" ]; then
    print_status error "port cannot be null."
    exit 1
fi

read -p "Enter how many DEPTH is the desired commit a way from the latest: " DEPTH
if [ -z "$DEPTH" ]; then
    print_status error "DEPTH cannot be empty."
    exit 1
fi


print_status info "Starting production spin-up for slot: $SLOT on port $PORT"
print_status info "Using commit: $COMMIT_HASH"


# --- Main Execution ---

# 1. Ensure logs directory exists
mkdir -p "logs_$SLOT"

# 2. Fetch latest changes from origin and checkout the specific commit
print_status info "Fetching from git and checking out commit..."
git fetch --depth=$DEPTH origin production
git checkout "$COMMIT_HASH"

# 4. Build and start the specified container
print_status info "Building and starting container web_$SLOT..."
docker compose up -d --build "web_$SLOT"

# 5. Wait for the new container to become healthy
until curl -s "http://127.0.0.1:$PORT/is_healthy/" > /dev/null; do
    print_status info "Waiting for $SLOT to be healthy..."
    sleep 5
done
print_status success "Container web_$SLOT is healthy."

# 4. Set the Telegram webhook on the new production instance
print_status info "Setting telegram webhook on $SLOT ..."
docker compose exec web_$SLOT python manage.py set_telegram_webhook


# 7 switching back to the lates commit
print_status info "switching back to the lates commit"
git checkout - 

print_status success "\nDeployment complete! Production is running on web_$SLOT from commit $COMMIT_HASH."

# check status
./deploy.sh check_status
