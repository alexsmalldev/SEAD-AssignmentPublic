from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from requestAPI.models import Building
from requestAPI.serializers import BuildingSerializer, UserSimpleSerializer
from rest_framework.decorators import action
from django.contrib.auth.models import User

class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    pagination_class = None
    filterset_fields = ['name', 'city', 'postcode', 'country']
    search_fields = ['name', 'address_line1', 'address_line2', 'city', 'postcode', 'country']
    ordering_fields = ['name', 'address_line1', 'city', 'postcode', 'country']
    ordering = ['-name'] 

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'registration_list':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Building.objects.all()
        return Building.objects.filter(users=user)  

    @action(detail=False, methods=['get'])
    # this can technically be removed as redundant could just call list and filter fields but prefer to keep seperate 
    # plan to make changes to this in the future
    def registration_list(self, request):
        buildings = Building.objects.all()
        serializer = self.get_serializer(buildings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        building = self.get_object()
        users = building.users.all()
        serializer = UserSimpleSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def update_users(self, request, pk=None):
        building = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        # fetch users and check if all user_ids are valid
        users = User.objects.filter(id__in=user_ids)
        if users.count() != len(user_ids):
            return Response({"error": "One or more user IDs are invalid."}, status=status.HTTP_400_BAD_REQUEST)
        
        building.users.set(users)
        return Response({"message": "Building users updated successfully."})

    @action(detail=True, methods=['get'])
    def available_users(self, request, pk=None):
        building = self.get_object()
        available_users = User.objects.filter(is_superuser=False).exclude(buildings=building)
        serializer = UserSimpleSerializer(available_users, many=True)
        return Response(serializer.data)

