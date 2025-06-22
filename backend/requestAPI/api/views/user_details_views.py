from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from requestAPI.serializers import UserSerializer
from django.contrib.auth.models import User
from requestAPI.models import Building
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()  # base queryset for users

    def get_permissions(self):
        # only admins can crud, regular users can only read
        if self.action in ['list', 'create', 'destroy', 'superusers', 'users_not_assigned_to_building']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        # filter users based on query parameter for searching
        queryset = super().get_queryset()
        query = self.request.query_params.get('query', None)
        if query:
            return queryset.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query)
            ).distinct()
        return queryset

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        user = request.user  # get the logged-in user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        # handle user updates
        serializer = self.get_serializer(user, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request): 
        user_ids = request.data.get('user_ids', [])
        if not user_ids:
            return Response({"error": "No user IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(id__in=user_ids)
        if not users.exists():
            return Response({"error": "No users found for the provided IDs."}, status=status.HTTP_404_NOT_FOUND)

        for user in users:
            tokens = OutstandingToken.objects.filter(user=user)
            for token in tokens:
                BlacklistedToken.objects.get_or_create(token=token)  # blacklist tokens
            user.buildings.clear()  # clear user buildings

        users_deleted_count, _ = users.delete()
        return Response({"message": f"{users_deleted_count} user(s) deleted successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def assign_buildings(self, request, pk=None):
        user = self.get_object()  # get the specific user
        building_ids = request.data.get('building_ids', [])
        if not building_ids:
            return Response({"error": "No building IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        buildings = Building.objects.filter(id__in=building_ids)
        if buildings.count() != len(building_ids):
            return Response({"error": "One or more buildings do not exist."}, status=status.HTTP_400_BAD_REQUEST)

        user.buildings.set(buildings)
        return Response({"message": "Buildings assigned to user successfully."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def superusers(self, request):
        superusers = User.objects.filter(is_superuser=True)
        serializer = self.get_serializer(superusers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def users_not_assigned_to_building(self, request):
        building_id = request.query_params.get('building_id')
        if not building_id:
            return Response({"error": "Building ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            building = Building.objects.get(pk=building_id)
            users_not_assigned = User.objects.exclude(buildings=building).filter(is_staff=False)
            serializer = self.get_serializer(users_not_assigned, many=True)
            return Response(serializer.data)
        except Building.DoesNotExist:
            return Response({"error": "Building not found."}, status=status.HTTP_404_NOT_FOUND)
