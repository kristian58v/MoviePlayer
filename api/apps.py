from django.apps import AppConfig

from .cache import fetch_genres, fetch_genres_bulgarian


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        print("Caching genres")
        fetch_genres()
        print("Caching genres in bulgarian")
        fetch_genres_bulgarian()
        print("Ready")
