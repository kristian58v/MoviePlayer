# views.py in your Django app
import datetime
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt

from api.models import LogEntry

from dotenv import load_dotenv
import os

load_dotenv()
google_client_id = os.environ.get('GOOGLE_CLIENT_ID')


@csrf_exempt
def google_authenticate(request):
    data = json.loads(request.body)
    token = data.get('token')
    print(token)

    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)

        # idinfo['sub'] is unique to the user
        user_id = idinfo['sub']
        email = idinfo.get('email')

        encoded_jwt = jwt.encode({'user_id': user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                                 'your-secret-key', algorithm='HS256')

        LogEntry.objects.create(level='INFO', message="Login", user_id=email)

        return JsonResponse({"success": True, "token": encoded_jwt})
    except ValueError:
        # Invalid token
        return JsonResponse({"success": False, "error": "Invalid token"})
