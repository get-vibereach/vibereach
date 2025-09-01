from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import redirect, render

from scheduler.views import scheduler_inngest_view_path
from campaign.views import account_settings_view
from .views import health_check, redirect_to_login, home_view, home_ar_view



handler404 = 'clients.views.custom_404_view'


urlpatterns = [
    path('', home_ar_view, name='home_ar'),
    path('en/', home_view, name='home'),

    re_path(r'^admin/', include('admin_honeypot.urls')),
    path('fdudminramo/', admin.site.urls),
    
    path('campaign/', include('campaign.urls')),
    path('api/', include('api.urls')),
    path('accounts/', include('clients.urls')),
    path('support/', include('support.urls')),
    path('feedback/', include('feedback.urls')),

    path('is_healthy/', health_check, name='health_check'),

    path('account-settings/', account_settings_view, name='account_settings'),
]


urlpatterns += [scheduler_inngest_view_path]


from django.conf import settings
if settings.DEBUG:
    urlpatterns += [
        path('test-404/', lambda request: render(request, 'auth/404.html', status=404)),
    ]