from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


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

    # def __str__(self):
    #     user_info = f"User: {self.user.email}" if self.user else "No user associated"
    #     return f"{self.level} - {self.message[:50]} - {user_info}"

