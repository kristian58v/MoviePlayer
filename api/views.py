import logging

from bs4 import BeautifulSoup
from django.http import HttpResponse
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from MoviePlayer import settings
from api.cache import movie_genres, series_genres
from api.decorators import authenticated
from api.models import LogEntry

from dotenv import load_dotenv
import os

load_dotenv()
tmdb_api_key = os.environ.get('TMDB_API_KEY')


class FrontendAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                    This URL is only used when you have built the production
                    version of the app. Visit http://localhost:3000/ instead, or
                    run `yarn run build` to test the production version.
                """,
                status=501,
            )


@api_view(['GET'])
@authenticated
def search_movies_tv(request):
    # Base URL for the TMDb search/movie endpoint
    base_url = "https://api.themoviedb.org/3/search/multi"

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    # Required query parameter: 'query'
    query = request.query_params.get("query", None)
    if not query:
        return Response({"message": "Query parameter is required"}, status=400)

    # Construct query parameters from request parameters
    query_params = {
        "query": query,
        "include_adult": request.query_params.get("include_adult", "false"),
        "language": request.query_params.get("language", "en-US"),
        "page": request.query_params.get("page", 1),
        # Add more parameters as needed
        "primary_release_year": request.query_params.get("primary_release_year", ""),
        "region": request.query_params.get("region", ""),
        "year": request.query_params.get("year", "")
    }

    # Make the request to TMDb API with headers
    response = requests.get(base_url, headers=headers, params=query_params)
    data = response.json()
    results = data.get('results', [])

    # Use cached genres
    genre_movie = {genre['id']: genre['name'] for genre in movie_genres}
    genre_tv = {genre['id']: genre['name'] for genre in series_genres}

    # Add media_type to each movie
    for item in results:
        if item['media_type'] == 'movie':
            item['genre_names'] = [genre_movie.get(genre_id) for genre_id in item.get('genre_ids', []) if
                                   genre_movie.get(genre_id)]
        elif item['media_type'] == 'tv':
            item['genre_names'] = [genre_tv.get(genre_id) for genre_id in item.get('genre_ids', []) if
                                   genre_tv.get(genre_id)]

    LogEntry.objects.create(level='INFO', message=f"Query: {query}", user=request.user)

    # Return the response data as JSON
    return Response(data)


@api_view(['GET'])
@authenticated
def get_trending_movies(request):
    base_url = "https://api.themoviedb.org/3/trending/movie/week?language=en-US"

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    # Add additional query parameters as needed

    response = requests.get(base_url, headers=headers)
    data = response.json()
    results = data.get('results', [])

    # Use cached genres
    genre_map = {genre['id']: genre['name'] for genre in movie_genres}

    # Add media_type to each movie
    for item in results:
        item['media_type'] = 'movie'
        item['genre_names'] = [genre_map.get(genre_id) for genre_id in item.get('genre_ids', []) if
                               genre_map.get(genre_id)]

    LogEntry.objects.create(level='INFO', message="Trending Movies", user=request.user)

    return Response(data)


@api_view(['GET'])
@authenticated
def get_trending_series(request):
    base_url = "https://api.themoviedb.org/3/trending/tv/week?language=en-US"

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    # Add additional query parameters as needed

    response = requests.get(base_url, headers=headers)
    data = response.json()
    results = data.get('results', [])

    # Use cached genres
    genre_map = {genre['id']: genre['name'] for genre in series_genres}

    # Add media_type to each series
    for item in results:
        item['media_type'] = 'tv'
        item['genre_names'] = [genre_map.get(genre_id) for genre_id in item.get('genre_ids', []) if
                               genre_map.get(genre_id)]

    LogEntry.objects.create(level='INFO', message="Trending Series", user=request.user)

    return Response(data)


@api_view(['GET'])
@authenticated
def get_popular_movies(request):
    page = request.query_params.get('page', 1)

    base_url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&sort_by=popularity.desc"

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    response = requests.get(base_url, headers=headers)
    data = response.json()
    results = data.get('results', [])

    genre_map = {genre['id']: genre['name'] for genre in movie_genres}
    for item in results:
        item['media_type'] = 'movie'
        item['genre_names'] = [genre_map.get(genre_id) for genre_id in item.get('genre_ids', []) if
                               genre_map.get(genre_id)]

    LogEntry.objects.create(level='INFO', message="Popular Movies", user=request.user)

    return Response(data)


@api_view(['GET'])
@authenticated
def get_popular_series(request):
    page = request.query_params.get('page', 1)

    base_url = f"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&page={page}&sort_by=popularity.desc&with_original_language=en&vote_count.gte=100&without_genre=10763"

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    response = requests.get(base_url, headers=headers)
    data = response.json()
    results = data.get('results', [])

    # Use cached genres
    genre_map = {genre['id']: genre['name'] for genre in series_genres}

    # Add media_type to each series
    for item in results:
        item['media_type'] = 'tv'
        item['genre_names'] = [genre_map.get(genre_id) for genre_id in item.get('genre_ids', []) if
                               genre_map.get(genre_id)]

    LogEntry.objects.create(level='INFO', message="Popular Series", user=request.user)

    return Response(data)


@api_view(['GET'])
@xframe_options_exempt
@authenticated
def proxy_view(request):
    external_url = request.GET.get('url')
    try:
        response = requests.get(external_url)
    except requests.RequestException as e:
        return HttpResponse(f"Error fetching content: {e}", status=500)

    content = response.text

    print(content)

    soup = BeautifulSoup(response.content, 'html.parser')
    print("soup")
    print(soup)

    return HttpResponse(content, content_type=response.headers.get('Content-Type', 'text/html'))
