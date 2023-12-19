# views.py in your Django app
import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import requests

from api.models import LogEntry

from dotenv import load_dotenv
import os

load_dotenv()
google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
redirect_url = os.environ.get('REDIRECT_URL')


# OLD FUNCTION USED FOR EXPLICIT FLOW
# @csrf_exempt
# def google_authenticate(request):
#     data = json.loads(request.body)
#     token = data.get('token')
#     print(token)
#
#     try:
#         # Specify the CLIENT_ID of the app that accesses the backend:
#         idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)
#
#         # idinfo['sub'] is unique to the user
#         user_id = idinfo['sub']
#         email = idinfo.get('email')
#
#         encoded_jwt = jwt.encode({'user_id': user_id,
#                                   'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
#                                   'your-secret-key', algorithm='HS256')
#
#         LogEntry.objects.create(level='INFO', message="Login", user_id=email)
#
#         return JsonResponse({"success": True, "token": encoded_jwt})
#     except ValueError:
#         # Invalid token
#         return JsonResponse({"success": False, "error": "Invalid token"})


@require_POST
@csrf_exempt
def exchange_code(request):
    try:
        data = json.loads(request.body)
        code = data.get('code')

        if not code:
            return JsonResponse({'message': 'Code is missing'}, status=400)

        # print("Exchanging code")

        # Exchange the code for tokens
        response = requests.post('https://oauth2.googleapis.com/token', data={
            'code': code,
            'client_id': google_client_id,
            'client_secret': google_client_secret,
            'redirect_uri': redirect_url,
            'grant_type': 'authorization_code'
        })
        response_data = response.json()
        # print(response)

        # print("Data from obtaining tokens:", response_data)

        access_token = response_data.get('access_token')
        refresh_token = response_data.get('refresh_token')

        # Authenticate the user and create a session
        user_info = get_google_user_info(access_token)

        # print("User info", user_info)

        if user_info:
            user = create_or_update_user(user_info)
            login(request, user)  # Django's login function to create a session

            LogEntry.objects.create(level='INFO', message="User Login", user=user)

            return JsonResponse({'message': 'Success',
                                 'email': user.email,
                                 'first_name': user.first_name,
                                 'last_name': user.last_name})
        else:
            # return JsonResponse({'redirect': redirect_url})
            # return JsonResponse(response.json())
            return JsonResponse({'message': 'User Info Missing:'})

    except Exception as e:
        print(e)
        return JsonResponse({'message': str(e)}, status=500)


def get_google_user_info(access_token):
    response = requests.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return response.json() if response.status_code == 200 else None


def create_or_update_user(user_info):
    # print("creating user")

    user, created = User.objects.get_or_create(
        username=user_info['sub'],
        defaults={
            'email': user_info['email'],
            'first_name': user_info.get('given_name', ''),
            'last_name': user_info.get('family_name', '')
        }
    )

    if not created:
        # Update the user only if their name has changed
        if user.first_name != user_info['given_name'] or user.last_name != user_info['family_name']:
            user.first_name = user_info['given_name']
            user.last_name = user_info['family_name']
            user.save()
            LogEntry.objects.create(level='INFO', message="User Updated", user=user)
    else:
        LogEntry.objects.create(level='INFO', message="User Created", user=user)

    return user


@require_GET
def verify_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True,
                             'email': request.user.email,
                             'first_name': request.user.first_name,
                             'last_name': request.user.last_name})
    else:
        return JsonResponse({'authenticated': False}, status=401)


@require_POST
@csrf_exempt
def logout_user(request):
    LogEntry.objects.create(level='INFO', message="User Logout", user=request.user)
    logout(request)  # This clears the user's session
    return JsonResponse({'message': 'Logged out successfully'})
