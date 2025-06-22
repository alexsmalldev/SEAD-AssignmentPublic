from django.urls import re_path
from .consumers import NotificationConsumer

# like standard http url patterns defined for the web socket
websocket_urlpatterns = [
    re_path(r'^ws/notifications/$', NotificationConsumer.as_asgi()),
]