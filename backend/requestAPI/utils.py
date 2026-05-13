from rest_framework.views import exception_handler
from .models import ErrorLog
import traceback
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import boto3
import json
import logging
import os

logger = logging.getLogger(__name__)

sqs = boto3.client('sqs', region_name='eu-north-1')

QUEUE_URL = os.environ.get('SQS_NOTIFICATION_QUEUE_URL')

def publish_notification(payload: dict) -> None:
    if not QUEUE_URL:
        logger.error('SQS_NOTIFICATION_QUEUE_URL environment variable is not set')
        return
    try:
        sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps(payload)
        )
        logger.info(f"Notification published to SQS for request {payload.get('requestId')}")
    except Exception as e:
        logger.error(f"Failed to publish notification to SQS: {str(e)}")

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