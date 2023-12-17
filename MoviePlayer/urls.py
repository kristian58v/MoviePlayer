"""
URL configuration for MoviePlayer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from api.auth_view import exchange_code, verify_auth, logout_user
from api import views
from api.views import FrontendAppView
from django.urls import re_path as url

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/search/movies/', views.search_movies_tv, name='movie-search'),

    path('api/popular/movies/', views.get_popular_movies, name='popular-movies'),
    path('api/popular/series/', views.get_popular_series, name='popular-series'),

    path('api/trending/movies/', views.get_trending_movies, name='trending-movies'),
    path('api/trending/series/', views.get_trending_series, name='trending-series'),

    # path('api/google-authenticate', google_authenticate, name="google-authenticate"),

    path('api/exchange_code', exchange_code, name="exchange_code"),
    path('api/verify_auth', verify_auth, name="verify_auth"),
    path('api/logout', logout_user, name="logout_user"),

    path('proxy/', views.proxy_view, name='proxy_view'),

    url(r'^', FrontendAppView.as_view())

]
