from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count
from django.db.models.functions import TruncDay
from ...models import ServiceRequest, Update
from requestAPI.serializers import UpdateSerializer, ServiceRequestSerializer
from django.db.models import Q


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def requests_over_time(self, request):
        """Returns service requests over time for a specified timeframe (7 days, 30 days, or 3 months)."""
        # Get the timeframe from query params (default to '3months')
        timeframe = request.query_params.get('timeframe', '3months')
        
        current_date = timezone.now()
        
        # Adjust start_date based on the timeframe provided
        if timeframe == '7days':
            start_date = current_date - timedelta(days=7)
        elif timeframe == '30days':
            start_date = current_date - timedelta(days=30)
        else:  # Default to last 3 months (90 days)
            start_date = current_date - timedelta(days=90)

        # Group service requests by day and count the number of requests each day
        requests_over_time = ServiceRequest.objects.filter(
            created_date__gte=start_date
        ).annotate(day=TruncDay('created_date')).values('day').annotate(count=Count('id')).order_by('day')

        return Response({'requests_over_time': requests_over_time})
    
    @action(detail=False, methods=['get'])
    def todays_updates(self, request):
        """Returns all service request updates created today, visible only to admins."""
        # Ensure only admins can access this endpoint
        if not request.user.is_superuser:
            return Response({"detail": "Not authorized to view this data."}, status=403)

        # Get the current date and time range for today
        current_date = timezone.now().date()

        # Filter updates that were created today
        updates_today = Update.objects.filter(
            created_date__date=current_date, 
            type="message"  
        ).order_by('-created_date')

        # Serialize the updates using your existing UpdateSerializer
        updates_serialized = UpdateSerializer(updates_today, many=True)

        return Response({'updates_today': updates_serialized.data})
    
     
    @action(detail=False, methods=['get'])
    def action_required(self, request):
        """Returns service requests where the SLA date is within 3 days of now or overdue."""
        current_date = timezone.now()
        three_days_ahead = current_date + timedelta(days=3)

        # Filter for requests with SLA date either within the next 3 days or overdue
        urgent_requests = ServiceRequest.objects.filter(
            service_level_agreement_date__lte=three_days_ahead,  # SLA date is either overdue or within the next 3 days
            status__in=['open', 'in_progress']  # Only include open or in-progress requests
        ).order_by('service_level_agreement_date')  # Sort by closest SLA date first

        # Pass the request context to the serializer
        serialized_requests = ServiceRequestSerializer(urgent_requests, many=True, context={'request': request})

        return Response({'actions_required': serialized_requests.data})

    @action(detail=False, methods=['get'])
    def requests_by_building(self, request):
        """Returns service requests grouped by building (not time-sensitive)."""
        # Get the count of requests for each building, no time filtering
        requests_by_building = ServiceRequest.objects.values('building__name').annotate(count=Count('id')).order_by('-count')

        return Response({'requests_by_building': requests_by_building})

    @action(detail=False, methods=['get'])
    def requests_by_service_type(self, request):
        """Returns service requests grouped by service type (not time-sensitive)."""
        # Get the count of requests for each service type, no time filtering
        requests_by_service_type = ServiceRequest.objects.values('service_request_item__name').annotate(count=Count('id')).order_by('-count')

        return Response({'requests_by_service_type': requests_by_service_type})

    @action(detail=False, methods=['get'])
    def general_stats(self, request):
        """Returns general statistics (open, in-progress, completed, and overdue requests)."""
        current_date = timezone.now()

        stats = {
            'open_requests': {
                'value': ServiceRequest.objects.filter(status='open').count(),
            },
            'in_progress_requests': {
                'value': ServiceRequest.objects.filter(status='in_progress').count(),
            },
            'completed_requests': {
                'value': ServiceRequest.objects.filter(status='completed').count(),
            }
        }

        return Response({'stats': stats})

