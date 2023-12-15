import requests

movie_genres = []
series_genres = []


def fetch_genres():
    global movie_genres, series_genres

    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY2ZTExNjUyZDliN2Q5ZmMxYzVmNDQ5MWVjOGU2ZCIsInN1YiI6IjY1NTQxOGJhYWQ1MGYwMDE0MjljYmJlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zfbF16m5CT319IjUc8cYcna_tqFv5DqdlPfVqYCiIqE"
    }

    movie_url = "https://api.themoviedb.org/3/genre/movie/list?language=en"
    series_url = "https://api.themoviedb.org/3/genre/tv/list?language=en"

    movie_response = requests.get(movie_url, headers=headers)
    series_response = requests.get(series_url, headers=headers)

    if movie_response.status_code == 200:
        movie_genres = movie_response.json().get('genres', [])

    if series_response.status_code == 200:
        series_genres = series_response.json().get('genres', [])
