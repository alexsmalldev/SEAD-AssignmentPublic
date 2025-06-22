
from django_filters.rest_framework import DjangoFilterBackend
from ...models import Update, ServiceRequest
from ...serializers import UpdateSerializer
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ...models import Update, ServiceRequest
from ...serializers import UpdateSerializer
from django.shortcuts import get_object_or_404
from requestAPI.utils import send_notification_to_user

class UpdateViewSet(viewsets.ModelViewSet):
    serializer_class = UpdateSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['service_request', 'type', 'is_read']
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:                                                                                                                                        
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if self.action != 'service_request_updates':
            if not user.is_superuser and not user.is_staff:
                return Update.objects.filter(associated_to=user)
            else:
                return Update.objects.all()
        else:
            return Update.objects.all() 
        
    

    def perform_create(self, serializer):
        service_request_id = self.kwargs.get('service_request_id') or self.request.data.get('service_request')
        service_request = ServiceRequest.objects.get(id=service_request_id)

        if self.request.user.is_superuser:
            associated_to = service_request.created_by
        else:
            associated_to = None

        update_type = self.request.data.get('type', 'message')


        if not self.request.user.is_superuser:
            # only admins can create request events
            update_type = 'message'

    
        # save with serializer to ensure fields are valid
        update = serializer.save(
            title=f"A Comment has been added to Request {service_request.id}",
            created_by=self.request.user,
            associated_to=associated_to,
            service_request=service_request,  
            type=update_type
        )

        # send update to user if user is connected
        if associated_to:
            notification = {
                "id": update.id,
                "title": update.title,
                "message": update.message,
                "service_request_id": service_request.id,
                "type": update.type
            }
            send_notification_to_user(associated_to.id, notification)

    @action(detail=False, methods=['get', 'post'])
    def service_request_updates(self, request):
        if request.method == 'GET':
            service_request_id = request.query_params.get("service_request_id")
            if not service_request_id:
                return Response({"error": "service_request_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            updates = self.get_queryset().filter(service_request_id=service_request_id)
            serializer = self.get_serializer(updates, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            service_request_id = request.data.get("service_request_id")
            if not service_request_id:
                return Response({"error": "service_request_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            service_request = get_object_or_404(ServiceRequest, id=service_request_id)

            message = request.data.get("message", "")
            
            try:
                title = f"A Comment has been added to Request {service_request_id}"
                if request.user.id == service_request.created_by:
                    associated_to_user = None
                else:
                    associated_to_user = service_request.created_by

                update = Update.objects.create(
                    title=title,
                    message=message,
                    created_by=request.user,
                    service_request=service_request,
                    type="message",
                    associated_to=associated_to_user
                )
                serializer = UpdateSerializer(update)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def notifications(self, request):
        user = self.request.user
        updates = self.get_queryset().filter(associated_to=user, is_read=False).exclude(created_by=user).order_by('is_read', '-created_date')
        serializer = self.get_serializer(updates, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        user = request.user
        updates = self.get_queryset().filter(is_read=False, associated_to=user)
        updates.update(is_read=True)
        return Response({'status': 'All updates marked as read'})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, id=None):
        update = self.get_object()
        # ensure user can mark other peoples notification as read
        if request.user != update.associated_to:
            return Response({"error": "You do not have permission to mark this update as read."}, status=status.HTTP_403_FORBIDDEN)

        update.is_read = True
        update.save()
        return Response({'status': 'Update marked as read'})