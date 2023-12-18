from rest_framework import serializers
from .models import WatchedItem


class WatchedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedItem
        fields = ['watched_on', 'movie_series_id', 'movie_series_title']
