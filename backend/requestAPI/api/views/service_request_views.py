from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from ...models import ServiceRequest, Update, User, ServiceType
from ...serializers import ServiceRequestSerializer, ServiceTypeSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from requestAPI.utils import send_notification_to_user

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id', 'service_request_item', 'building', 'priority', 'status', 'created_date', 'service_level_agreement_date']
    ordering_fields = ['id', 'service_request_item', 'building', 'priority', 'status', 'created_date', 'service_level_agreement_date']
    ordering = ['-id']

    def get_queryset(self):
        user = self.request.user
        service_request_id = self.request.query_params.get('id', None)
        queryset = ServiceRequest.objects.all()
        if user.is_superuser:
            return queryset.order_by('service_level_agreement_date')

        queryset = queryset.filter(created_by=user).order_by('-created_date')

        if service_request_id:
            queryset = queryset.filter(id=service_request_id)

        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # overrite the get and return erorr if user tries to access request they have not created
        if not (request.user == instance.created_by or request.user.is_superuser):
            raise PermissionDenied("You do not have permission to access this service request.")

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    def perform_create(self, serializer):
        service_request = serializer.save()
        Update.objects.create(
            title="Request Created",
            message=f"Request {service_request.id} created",
            created_by=self.request.user,
            service_request=service_request,
            type="event"
        )
        return service_request
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        service_request = self.get_object()
        serializer = self.get_serializer(service_request, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            new_status = serializer.validated_data.get('status')
            if new_status not in dict(ServiceRequest.STATUS_CHOICES).keys():
                return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)
            friendly_status = dict(ServiceRequest.STATUS_CHOICES)[new_status]

            if new_status:
                status_update = Update.objects.create(
                    title=f"Request {service_request.id} Status Update",
                    message=f"Request {service_request.id} has been moved to {friendly_status}",
                    created_by=request.user,
                    associated_to=service_request.created_by,
                    service_request=service_request,
                    type="event"
                )
                
                notification = {
                            "id": status_update.id,
                            "title": status_update.title,
                            "message": status_update.message,
                            "service_request_id": service_request.id,
                            "type": status_update.type
                }
                send_notification_to_user(service_request.created_by.id, notification)

            comment = request.data.get('comment')
            if comment:
                Update.objects.create(
                    title=f"A Comment has been added to Request {service_request.id}",
                    message=comment,
                    created_by=request.user,
                    associated_to=service_request.created_by,
                    service_request=service_request,
                    type="message"
                )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
    @action(detail=False, methods=['get'])
    def user_home_data(self, request):
        # get user requests
        queryset = ServiceRequest.objects.filter(created_by=request.user)
        
        # get 10 most recent
        recent_requests = queryset.order_by('-created_date')[:10]
        recent_requests_serialized = ServiceRequestSerializer(recent_requests, many=True, context={'request': request}).data

        # get service types for those request and return unique
        recent_service_types = queryset.order_by('-created_date').values('service_request_item').distinct()[:10]
        recent_service_types_ids = [item['service_request_item'] for item in recent_service_types]
        recent_service_types_objs = ServiceType.objects.filter(id__in=recent_service_types_ids)
        recent_service_types_serialized = ServiceTypeSerializer(recent_service_types_objs, many=True, context={'request': request}).data

        return Response({
            'recent_requests': recent_requests_serialized,
            'recent_service_types': recent_service_types_serialized,
        })

    
        




