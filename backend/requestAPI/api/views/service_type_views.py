from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from ...models import ServiceType
from ...serializers import ServiceTypeSerializer

class ServiceTypeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceTypeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    ordering = ['name']

    def get_permissions(self):
        # only admins can crud
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        else: # regular only read
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        # regular should only see active
        if user.is_superuser or user.is_staff:
            return ServiceType.objects.all()
        return ServiceType.objects.filter(is_active=True)
