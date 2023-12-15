from django.contrib import admin
from .models import LogEntry


class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'level', 'message', 'user_id')

    # If you want to truncate the message in the admin list view
    def get_message_preview(self, obj):
        return obj.message[:50]

    get_message_preview.short_description = 'Message Preview'

    # If you want to format the datetime display
    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')

    get_created_at.admin_order_field = 'created_at'
    get_created_at.short_description = 'Created At'


admin.site.register(LogEntry, LogEntryAdmin)
