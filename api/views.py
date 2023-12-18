import json
import logging

from bs4 import BeautifulSoup
from django.core.paginator import Paginator, EmptyPage
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from MoviePlayer import settings
from api.cache import movie_genres, series_genres
from api.decorators import authenticated
from api.models import LogEntry, WatchedItem

from dotenv import load_dotenv
import os

from api.serializers import WatchedItemSerializer

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


@require_POST
@csrf_exempt
@authenticated
def post_watched_item(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user = request.user
    movie_series_id = data.get('movie_series_id')
    movie_series_title = data.get('movie_series_title')
    media_type = data.get('media_type')

    if not movie_series_id or not movie_series_title:
        return JsonResponse({"error": "Missing movie_series_id or movie_series_title"}, status=400)

    watched_item, created = WatchedItem.objects.get_or_create(
        user=user,
        movie_series_id=movie_series_id,
        defaults={'movie_series_title': movie_series_title, 'media_type': media_type}
    )

    if not created:
        watched_item.watched_on = timezone.now()
        watched_item.save()

    return JsonResponse({"status": "success", "message": "Watched item updated or created"})


@api_view(['GET'])
@authenticated
def get_watched_items(request):
    user = request.user

    # Get page number from request, default to 1
    page_number = request.query_params.get('page', 1)

    watched_items = WatchedItem.objects.filter(user=user).order_by('-watched_on')

    # Initialize Paginator
    paginator = Paginator(watched_items, 10)  # Show 10 items per page
    try:
        watched_items_page = paginator.page(page_number)
    except EmptyPage:
        # If page is out of range, return empty list
        return JsonResponse({"results": []})

    # TMDb API Key as Bearer token
    headers = {
        "Authorization": "Bearer " + tmdb_api_key
    }

    detailed_watched_items = []
    for item in watched_items_page:
        media_type = item.media_type
        movie_series_id = item.movie_series_id
        details_url = f"https://api.themoviedb.org/3/{media_type}/{movie_series_id}"

        response = requests.get(details_url, headers=headers)
        if response.status_code == 200:
            tmdb_data = response.json()
            watched_item_details = {
                'watched_on': item.watched_on,
                'movie_series_id': item.movie_series_id,
                'movie_series_title': item.movie_series_title,
                'media_type': item.media_type,

                'poster_path': tmdb_data.get('poster_path'),
                'overview': tmdb_data.get('overview'),
                'vote_average': tmdb_data.get('vote_average'),
                'vote_count': tmdb_data.get('vote_count'),
                'name': tmdb_data.get('name', tmdb_data.get('title')),  # Use 'name' or 'title' as appropriate
                'title': tmdb_data.get('title', tmdb_data.get('name')),  # Use 'title' or 'name' as appropriate
                'first_air_date': tmdb_data.get('first_air_date', tmdb_data.get('release_date')),
                # Use 'first_air_date' or 'release_date' as appropriate
                'release_date': tmdb_data.get('release_date', tmdb_data.get('first_air_date'))
                # Use 'release_date' or 'first_air_date' as appropriate
            }
            detailed_watched_items.append(watched_item_details)

            # poster_path, media_type, overview, vote_average, vote_count, name, title, first_air_date, release_date

    return JsonResponse({"results": detailed_watched_items})


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
