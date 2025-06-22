from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from requestAPI.models import ServiceRequest, Update, Building, ServiceType

class DashboardViewSetTests(TestCase):
    def setUp(self):

        self.client = APIClient()
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.regular_user = User.objects.create_user('regular', 'regular@test.com', 'regularpass')
        
        self.building = Building.objects.create(
            name="Test Building",
            address_line1="123 Test St",
            city="Test City",
            postcode="12345",
            latitude=51.5074,
            longitude=-0.1278
        )
        
        self.service_type = ServiceType.objects.create(
            name="Test Service",
            description="Test Description"
        )
        
        statuses = ['open', 'in_progress', 'completed']
        priorities = ['low', 'medium', 'high']
        for i in range(30):
            days_ago = 30 - i
            ServiceRequest.objects.create(
                customer_notes=f"Test request {i}",
                status=statuses[i % 3],
                priority=priorities[i % 3],
                created_by=self.admin_user,
                service_request_item=self.service_type,
                building=self.building,
                created_date=timezone.now() - timedelta(days=days_ago)
            )

        for i in range(5):
            Update.objects.create(
                message=f"Test update {i}",
                created_by=self.admin_user,
                service_request=ServiceRequest.objects.first(),
                type='message',
                created_date=timezone.now()
            )


    def test_todays_updates(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('dashboard-todays-updates'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('updates_today', response.data)
        
        today = timezone.now().date()
        for update in response.data['updates_today']:
            update_date = timezone.datetime.strptime(update['created_date'], "%Y-%m-%dT%H:%M:%S.%fZ").date()
            self.assertEqual(update_date, today)
        
        today_updates_count = Update.objects.filter(created_date__date=today, type="message").count()
        self.assertEqual(len(response.data['updates_today']), today_updates_count)

    def test_action_required(self):
        self.client.force_authenticate(user=self.admin_user)
        
        urgent_request = ServiceRequest.objects.create(
            customer_notes="Urgent request",
            status='open',
            priority='high',
            created_by=self.admin_user,
            service_request_item=self.service_type,
            building=self.building,
            service_level_agreement_date=timezone.now() + timedelta(days=2)
        )
        overdue_request = ServiceRequest.objects.create(
            customer_notes="Overdue request",
            status='in_progress',
            priority='high',
            created_by=self.admin_user,
            service_request_item=self.service_type,
            building=self.building,
            service_level_agreement_date=timezone.now() - timedelta(days=1)
        )
        
        response = self.client.get(reverse('dashboard-action-required'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('actions_required', response.data)
        
        request_ids = [req['id'] for req in response.data['actions_required']]
        self.assertIn(urgent_request.id, request_ids)
        self.assertIn(overdue_request.id, request_ids)
        
        far_future_request = ServiceRequest.objects.create(
            customer_notes="Future request",
            status='open',
            priority='low',
            created_by=self.admin_user,
            service_request_item=self.service_type,
            building=self.building,
            service_level_agreement_date=timezone.now() + timedelta(days=10)
        )
        self.assertNotIn(far_future_request.id, request_ids)

    def test_requests_by_building(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('dashboard-requests-by-building'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('requests_by_building', response.data)
        
        for building_data in response.data['requests_by_building']:
            actual_count = ServiceRequest.objects.filter(building__name=building_data['building__name']).count()
            self.assertEqual(building_data['count'], actual_count)

    def test_requests_by_service_type(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('dashboard-requests-by-service-type'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('requests_by_service_type', response.data)
        
        for service_data in response.data['requests_by_service_type']:
            actual_count = ServiceRequest.objects.filter(service_request_item__name=service_data['service_request_item__name']).count()
            self.assertEqual(service_data['count'], actual_count)

    def test_general_stats(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('dashboard-general-stats'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('stats', response.data)
        
        for status_type in ['open', 'in_progress', 'completed']:
            actual_count = ServiceRequest.objects.filter(status=status_type).count()
            self.assertEqual(response.data['stats'][f'{status_type}_requests']['value'], actual_count)
