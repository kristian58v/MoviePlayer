from functools import wraps

from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests


def authenticated(f):
    @wraps(f)
    def decorated(request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header:
            return JsonResponse({'message': 'Token is missing'}, status=401)

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return JsonResponse({'message': 'Invalid Authorization header format'}, status=401)

        google_token = parts[1]

        try:
            id_token_info = id_token.verify_oauth2_token(google_token, requests.Request(),
                                                         "680391911110-ni5pf2h1bih6ljnumfccob0nip6su1mg.apps.googleusercontent.com")
            request.user_id = id_token_info['sub']
            request.email = id_token_info['email']
        except ValueError:
            return JsonResponse({'message': 'Invalid token'}, status=401)

        return f(request, *args, **kwargs)

    return decorated
