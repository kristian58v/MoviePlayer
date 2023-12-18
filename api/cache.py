import os

import requests
from dotenv import load_dotenv

movie_genres = []
series_genres = []

movie_genres_bg = []
series_genres_bg = []

load_dotenv()
tmdb_api_key = os.environ.get('TMDB_API_KEY')


def fetch_genres():
    global movie_genres, series_genres

    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    movie_url = "https://api.themoviedb.org/3/genre/movie/list?language=en"
    series_url = "https://api.themoviedb.org/3/genre/tv/list?language=en"

    movie_response = requests.get(movie_url, headers=headers)
    series_response = requests.get(series_url, headers=headers)

    if movie_response.status_code == 200:
        movie_genres = movie_response.json().get('genres', [])

    if series_response.status_code == 200:
        series_genres = series_response.json().get('genres', [])


def fetch_genres_bulgarian():
    global movie_genres_bg, series_genres_bg

    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    movie_url = "https://api.themoviedb.org/3/genre/movie/list?language=bg"
    series_url = "https://api.themoviedb.org/3/genre/tv/list?language=bg"

    movie_response = requests.get(movie_url, headers=headers)
    series_response = requests.get(series_url, headers=headers)

    if movie_response.status_code == 200:
        movie_genres_bg = movie_response.json().get('genres', [])

    if series_response.status_code == 200:
        series_genres_bg = series_response.json().get('genres', [])
