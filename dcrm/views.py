from django.shortcuts import render
from django.contrib.auth.decorators import login_not_required








@login_not_required
def home_view(request):
    """Feedback and feature requests page"""
    return render(request, "home/landing.html")





@login_not_required
def home_ar_view(request):
    """Feedback and feature requests page"""
    return render(request, "home/landing-ar.html")