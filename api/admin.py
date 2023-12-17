from django.contrib import admin
from .models import LogEntry


class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'level', 'get_message_preview', 'get_user_email', 'get_user_name')

    def get_message_preview(self, obj):
        return obj.message[:50]

    get_message_preview.short_description = 'Message Preview'

    def get_user_email(self, obj):
        return obj.user.email if obj.user else '-'

    get_user_email.admin_order_field = 'user__email'  # Allows column order sorting
    get_user_email.short_description = 'User Email'

    def get_user_name(self, obj):
        return obj.user.get_full_name() if obj.user else '-'

    get_user_name.admin_order_field = 'user__first_name'  # Adjust as needed
    get_user_name.short_description = 'User Name'

    # Optional: Formatting for created_at display
    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')

    get_created_at.admin_order_field = 'created_at'
    get_created_at.short_description = 'Created At'


admin.site.register(LogEntry, LogEntryAdmin)
