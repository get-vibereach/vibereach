# Core API Documentation

This document provides instructions and examples for testing the Core API endpoints using `curl`.

## Authentication

All Core API endpoints require a valid JWT Bearer token for authentication.

### Generating a Token

1.  Navigate to the Django Admin panel of your local instance (e.g., `http://localhost:8000/admin/`).
2.  Go to the "Users" section (`/admin/clients/customuser/`).
3.  Select the user you want to generate a token for by checking the box next to their username.
4.  From the "Actions" dropdown menu at the top of the list, select "Generate JWT Access Token" and click "Go".
5.  A success message will appear at the top of the page containing the access token inside a textarea. Copy this token.

### Using the Token

In all subsequent `curl` commands, replace `<YOUR_TOKEN>` with the token you copied from the admin panel. The token must be included in the `Authorization` header as a Bearer token.

**Example Header:**
```bash
-H "Authorization: Bearer <YOUR_TOKEN>"
```

## Base URL

All API endpoints are relative to the following base URL:
`http://localhost:8000/api/core/`

---

## API Endpoints

Below are the available endpoints, grouped by resource. Replace placeholders like `<id>`, `<product_id>`, etc., with actual IDs from your database.

### Products

*   **List Products**
    ```bash
    curl -X GET http://localhost:8000/api/core/products/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Create Product**
    ```bash
    curl -X POST http://localhost:8000/api/core/products/ \
    -H "Authorization: Bearer <YOUR_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "My New Product",
        "description": "A great product."
    }'
    ```

*   **Retrieve Product**
    ```bash
    curl -X GET http://localhost:8000/api/core/products/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Update Product**
    ```bash
    curl -X PUT http://localhost:8000/api/core/products/<id>/ \
    -H "Authorization: Bearer <YOUR_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Updated Product Name"
    }'
    ```

*   **Delete Product**
    ```bash
    curl -X DELETE http://localhost:8000/api/core/products/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Email Accounts

*   **List Email Accounts**
    ```bash
    curl -X GET http://localhost:8000/api/core/email-accounts/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Retrieve Email Account**
    ```bash
    curl -X GET http://localhost:8000/api/core/email-accounts/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Campaigns

*   **List Campaigns**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Retrieve Campaign**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaigns for a Product**
    ```bash
    curl -X GET http://localhost:8000/api/core/products/<product_id>/campaigns/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Lead Lists

*   **List Lead Lists**
    ```bash
    curl -X GET http://localhost:8000/api/core/leadlists/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Retrieve Lead List**
    ```bash
    curl -X GET http://localhost:8000/api/core/leadlists/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Leads

*   **List Leads in a Lead List**
    ```bash
    curl -X GET http://localhost:8000/api/core/leadlists/<leadlist_id>/leads/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Create Lead**
    ```bash
    curl -X POST http://localhost:8000/api/core/leads/ \
    -H "Authorization: Bearer <YOUR_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
        "lead_list": 1,
        "email": "new.lead@example.com",
        "first_name": "New",
        "last_name": "Lead"
    }'
    ```

*   **Retrieve Lead**
    ```bash
    curl -X GET http://localhost:8000/api/core/leads/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Campaign-Specific Endpoints

Replace `<campaign_id>` with the ID of the campaign you are querying.

*   **List Campaign Leads**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/leads/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaign Options**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/options/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaign Stats**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/stats/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaign Schedule**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/schedule/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaign Messages**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/messages/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Campaign Message Assignments**
    ```bash
    curl -X GET http://localhost:8000/api/core/campaigns/<campaign_id>/assignments/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

### Messages

*   **List Messages**
    ```bash
    curl -X GET http://localhost:8000/api/core/messages/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **Retrieve Message**
    ```bash
    curl -X GET http://localhost:8000/api/core/messages/<id>/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

*   **List Assignments for a Message**
    ```bash
    curl -X GET http://localhost:8000/api/core/messages/<message_id>/assignments/ -H "Authorization: Bearer <YOUR_TOKEN>"
    ```
