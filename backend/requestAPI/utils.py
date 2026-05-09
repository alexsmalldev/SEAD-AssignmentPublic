from rest_framework.views import exception_handler
from .models import ErrorLog
import traceback
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification_to_user(user_id, notification):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "notification": notification
        }
    )

def error_log_exception_handler(exc, context):
    response = exception_handler(exc, context)
    request = context['request']
    if response is not None:
        ErrorLog.objects.create(
            endpoint=request.path,
            error_message=f"{str(exc)}\n{traceback.format_exc()}",
        )
    return response



