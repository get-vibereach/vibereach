import logging

class UserFilter(logging.Filter):
    """
    A custom logging filter that adds user information to log records.
    """
    def filter(self, record):
        # Get the request from the log record if it exists
        request = getattr(record, 'request', None)
        
        # If request exists and has an authenticated user, add user info
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            record.user_id = getattr(request.user, 'id', 'unknown')
            record.user_first_name = getattr(request.user, 'first_name', 'unknown')
            record.user_last_name = getattr(request.user, 'last_name', 'unknown')
            record.user_username = getattr(request.user, 'username', 'unknown')
            # Add email since it's used in the formatter
            record.user_email = getattr(request.user, 'email', 'unknown')
        else:
            # If no authenticated user, mark as anonymous
            record.user_id = 'anonymous'
            record.user_first_name = 'anonymous'
            record.user_last_name = 'anonymous'
            record.user_username = 'anonymous'
            record.user_email = 'anonymous'
        
        return True