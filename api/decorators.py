from functools import wraps
from django.http import JsonResponse


def authenticated(f):
    @wraps(f)
    def decorated(request, *args, **kwargs):
        # Check if the user is authenticated via Django's session management
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'User is not authenticated'}, status=401)

        # If authenticated, proceed with the original function
        return f(request, *args, **kwargs)

    return decorated
