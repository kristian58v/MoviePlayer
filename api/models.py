from django.db import models


class LogEntry(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=10)  # e.g., 'INFO', 'ERROR'
    message = models.TextField()
    user_id = models.CharField(max_length=255, null=True, blank=True)  # Optional user ID

    def __str__(self):
        return f"{self.level} - {self.message[:50]}"
