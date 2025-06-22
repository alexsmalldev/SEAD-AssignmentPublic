from channels.auth import AuthMiddlewareStack
from django.db import close_old_connections
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

# custom middleware - required for web sockets tow work using JWT tokens from current implementation
# gets connecting users auth token and validates it to ensure only right users can access - connection is one way also
@sync_to_async
def get_user(token_key):
    try:
        from django.contrib.auth import get_user_model
        from django.contrib.auth.models import AnonymousUser
        
        User = get_user_model() 
        from rest_framework_simplejwt.tokens import AccessToken
        access_token = AccessToken(token_key)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token:
            scope['user'] = await get_user(token)
        else:
            from django.contrib.auth.models import AnonymousUser
            scope['user'] = AnonymousUser()
            
        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))