import re
from django.conf import settings
from django.contrib.auth.middleware import LoginRequiredMiddleware
from django.http import HttpResponseForbidden, JsonResponse

class CustomLoginRequiredMiddleware(LoginRequiredMiddleware):
    def __init__(self, get_response=None):
        self.get_response = get_response
        self.open_urls = [re.compile(url) for url in getattr(settings, "OPEN_URLS", [])]
        super().__init__(get_response)

    def process_view(self, request, view_func, view_args, view_kwargs):
        for url in self.open_urls:
            if url.match(request.path):
                return None  # Skip auth
        return super().process_view(request, view_func, view_args, view_kwargs)


class ViewOnlyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.view_only_exempt_urls = [re.compile(url) for url in getattr(settings, "VIEW_ONLY_EXEMPT_URLS", [])]

    def __call__(self, request):
        if request.user.is_authenticated and request.user.groups.filter(name='View Only').exists():

            for url in self.view_only_exempt_urls:
                if re.match(url, request.path):
                    # Skip the 'View Only' check for these URLs
                    return self.get_response(request)

            if request.method not in ['GET', 'HEAD', 'OPTIONS']:
                if request.path.startswith('/api/'):
                    return JsonResponse({'error': 'Your subscription has expired. You are in view-only mode.'}, status=403)
                return HttpResponseForbidden('Your subscription has expired. You are in view-only mode.')

        response = self.get_response(request)
        return response



import logging

logger = logging.getLogger(__name__)

class RequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add request to logger context
        logger.info("Request started", extra={'request': request})
        
        response = self.get_response(request)
        
        # Log request completion
        logger.info("Request completed", extra={'request': request})
        
        return response