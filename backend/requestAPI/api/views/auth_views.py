from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from requestAPI.serializers import UserSerializer, UpdatePasswordSerializer
from django.core.exceptions import ValidationError


class AuthViewSet(viewsets.GenericViewSet):
    # allow any user to access these endpoints
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        # handle user registration
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "error": "Validation failed",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = serializer.save()
            return Response({
                "id": user.id,
                "message": "User Created Successfully."
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to create user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def login(self, request):
        # handle user login
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            # really need to change this to handle refresh on server side - will create Jira task if time
            refresh = RefreshToken.for_user(user)
            serializer = self.get_serializer(user) 
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data, 
                'message': 'Login successful'
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        # handle user logout and token blacklisting
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid token or token already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Logout failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def refresh_token(self, request):
        # handle refresh token to get a new access token - refresh token should be changed to session for better secuirty and XSS protection
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        except TokenError:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": f"Failed to refresh token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def update_password(self, request):
        # handle password update
        serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({
                "error": "Validation failed",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            request.user.set_password(serializer.validated_data['new_password1'])
            request.user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to update password: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

