from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging

logger = logging.getLogger(__name__)

# used during web socket connections
class NotificationConsumer(AsyncWebsocketConsumer):
    # only regular users require this connection, therefore check user auth and role before excepting
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated and not user.is_staff:
            await self.channel_layer.group_add(
                f"user_{user.id}",
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope['user']
        if user.is_authenticated:
            await self.channel_layer.group_discard(
                f"user_{user.id}",
                self.channel_name
            )
    
    # send notification  to user as json
    async def send_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification
        }))