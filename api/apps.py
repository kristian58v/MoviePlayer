from django.apps import AppConfig

from .cache import fetch_genres


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        print("Ready")
        fetch_genres()
