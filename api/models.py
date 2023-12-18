from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class LogEntry(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=10)  # e.g., 'INFO', 'ERROR'
    message = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='custom_log_entries'  # Unique related_name
    )

    def __str__(self):
        user_info = f"User: {self.user.email}" if self.user else "No user associated"
        return f"{self.level} - {self.message[:50]} - {user_info}"


class WatchedItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='watched_items'
    )
    watched_on = models.DateTimeField()
    movie_series_id = models.CharField(max_length=100)  # Assuming IDs are strings
    movie_series_title = models.CharField(max_length=255)
    media_type = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.watched_on = timezone.now()
        super(WatchedItem, self).save(*args, **kwargs)

    def __str__(self):
        return (f"{self.user.username} watched {self.media_type} '{self.movie_series_title}'"
                f"on {self.watched_on.strftime('%Y-%m-%d')}")
