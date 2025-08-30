from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.urls import reverse
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from api.serializers import (
    LoginSerializer, CompanyRegistrationSerializer, UserRegistrationSerializer, UserUpdateSerializer, TrialRegistrationSerializer
)
from .models import LoginToken, SubscribedCompany, CustomUser, SignupToken, Plan, Subscription
from django.contrib.auth.decorators import login_not_required
from django.utils.http import url_has_allowed_host_and_scheme
from django.utils import timezone

def trial_signup_view(request, token):
    try:
        signup_token = get_object_or_404(SignupToken, token=token)
        
        if signup_token.is_used:
            # Token has already been used
            return render(request, 'auth/404.html', {'message': 'This signup link has already been used.'}, status=410) # 410 Gone
            
        if signup_token.expires_at < timezone.now():
            # Token has expired
            return render(request, 'auth/404.html', {'message': 'This signup link has expired.'}, status=410)

        # Token is valid, render the signup form
        return render(request, 'auth/trial_signup.html', {'token': token, 'email': signup_token.email})

    except SignupToken.DoesNotExist:
        return render(request, 'auth/404.html', {'message': 'Invalid signup link.'}, status=404)

def custom_404_view(request, exception):
    return render(request, 'auth/404.html', status=404)

@login_not_required
def home_view(request):
    """Feedback and feature requests page"""
    return render(request, "home/landing.html")


# Template Views
@login_not_required
def login_view(request):
    """Login page template"""
    next_url = request.GET.get('next')
    context = {'next_url': next_url}
    return render(request, 'auth/login.html', context)


@login_not_required
def login_submit(request):
    """Handle login form submission"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)

                    next_url = request.POST.get('next') or request.GET.get('next')
                    
                    if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                        messages.success(request, f'Welcome back, {user.first_name}!')
                        return redirect(next_url)
                    else:
                        if user.first_name:
                            messages.success(request, f'Welcome back, {user.first_name}!')
                            return redirect('overall_dashboard')
                        else:
                            messages.success(request, f'Welcome back, {user.first_name}!')
                            return redirect('account_settings')


                else:
                    messages.error(request, 'Your account is disabled.')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Please enter both username and password.')

    next_url_on_failure = request.POST.get('next') or request.GET.get('next')
    return render(request, 'auth/login.html', {'next_url': next_url_on_failure})


def logout_view(request):
    """Logout page template"""
    logout(request)
    return redirect('home')


def company_registration_view(request):
    """Company registration page template"""
    return render(request, 'auth/company_registration.html')


def user_registration_view(request):
    """User registration page template"""
    company_data = request.session.get('company_data', {})
    return render(request, 'auth/user_registration.html', {'company_data': company_data})



# API Views
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """API endpoint for user login"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'redirect_url': reverse('products')
        }, status=status.HTTP_200_OK)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    """API endpoint for user logout"""
    logout(request)
    return Response({
        'success': True,
        'message': 'Logout successful',
        'redirect_url': reverse('login')
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_company_registration(request):
    """API endpoint for company registration (step 1)"""
    serializer = CompanyRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Store company data in session
        request.session['company_data'] = serializer.validated_data
        return Response({
            'success': True,
            'message': 'Company information saved',
            'redirect_url': reverse('user_registration')
        }, status=status.HTTP_200_OK)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_user_registration(request):
    """API endpoint for user registration (step 2)"""
    # Check if company data exists in session
    if 'company_data' not in request.session:
        return Response({
            'success': False,
            'message': 'Please complete company registration first.',
            'redirect_url': reverse('company_registration')
        }, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            # Create company first
            company_data = request.session['company_data']
            company = SubscribedCompany.objects.create(**company_data)

            # Create user and associate with company
            user = serializer.save()
            user.subscribed_company = company
            user.save()

            # Clear session data
            del request.session['company_data']

            # Log the user in
            login(request, user)

            return Response({
                'success': True,
                'message': 'Account created successfully! Welcome to Instantly.',
                'redirect_url': reverse('overall_dashboard')
            }, status=status.HTTP_201_CREATED)

        except Exception:
            # If company was created but user creation failed, clean up
            if 'company' in locals():
                company.delete()
            return Response({
                'success': False,
                'message': 'An error occurred during registration. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_trial_registration(request):
    serializer = TrialRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        
        try:
            signup_token = SignupToken.objects.get(token=token)

            if signup_token.is_used:
                return Response({'success': False, 'message': 'This signup link has already been used.'}, status=status.HTTP_410_GONE)
            
            if signup_token.expires_at < timezone.now():
                return Response({'success': False, 'message': 'This signup link has expired.'}, status=status.HTTP_410_GONE)

            user_data = serializer.validated_data['user']
            company_data = serializer.validated_data['company']

            # Check for existing user
            if CustomUser.objects.filter(email=user_data['email']).exists():
                return Response({
                    'success': False,
                    'message': 'A user with this email already exists.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create company
            company = SubscribedCompany.objects.create(**company_data)

            # Create user
            user = CustomUser.objects.create(
                subscribed_company=company,
                username=user_data['email'], # Use email as username
                **user_data
            )
            user.set_unusable_password()
            user.save()

            # Create a trial subscription for the new company
            try:
                trial_plan = Plan.objects.get(slug='trial')
                Subscription.objects.create(
                    subscribed_company=company,
                    plan=trial_plan,
                    status='trial',
                    billing_email=user.email,
                )
            except Plan.DoesNotExist:
                # Handle case where trial plan is not found
                # Maybe log an error or do nothing
                pass

            # Mark token as used
            signup_token.is_used = True
            signup_token.save()

            # Log the user in
            login(request, user)

            return Response({
                'success': True,
                'message': 'Account created successfully! Welcome to Instantly.',
                'redirect_url': reverse('overall_dashboard')
            }, status=status.HTTP_201_CREATED)

        except SignupToken.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid signup token.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)



from django.contrib.auth import get_user_model


def login_with_token_view(request, token):
    try:
        login_token = get_object_or_404(LoginToken, token=token)

        if login_token.is_used:
            return render(request, 'auth/404.html', {'message': 'This login link has already been used.'}, status=410)

        if login_token.expires_at < timezone.now():
            return render(request, 'auth/404.html', {'message': 'This login link has expired.'}, status=410)

        user = login_token.user
        login(request, user)
        login_token.is_used = True
        login_token.save()

        return redirect('overall_dashboard')

    except LoginToken.DoesNotExist:
        return render(request, 'auth/404.html', {'message': 'Invalid login link.'}, status=404)

User = get_user_model()

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # only allow updating the logged-in user
        return self.request.user
    

class UpdateCompanyInfoView(generics.UpdateAPIView):
    queryset = SubscribedCompany.objects.all()
    serializer_class = CompanyRegistrationSerializer

    def get_object(self):
        # only allow updating the logged-in user
        return self.request.user.subscribed_company
