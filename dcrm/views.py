from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_not_required

from django.db import connections
from django.http import HttpResponse
from django.db.utils import OperationalError






@login_not_required
def home_view(request):
    """Feedback and feature requests page"""
    return render(request, "home/landing.html")





@login_not_required
def home_ar_view(request):
    """Feedback and feature requests page"""
    return render(request, "home/landing-ar.html")





@login_not_required
def health_check(request):
    try:
        # Check database connectivity
        connections['default'].cursor()
        return HttpResponse("healthy", status=200)
    except OperationalError:
        return HttpResponse("unhealthy", status=503)




# def redirect_to_login(request):
#     return redirect('login')            