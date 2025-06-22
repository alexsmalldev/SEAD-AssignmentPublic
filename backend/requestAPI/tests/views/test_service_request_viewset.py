from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from requestAPI.models import Building, ServiceType, ServiceRequest, ErrorLog

class ServiceRequestViewSetTests(TestCase):
    def setUp(self):

        self.client = APIClient()
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.regular_user = User.objects.create_user('regular', 'regular@test.com', 'regularpass')
        self.building = Building.objects.create(
            name="Test Building",
            address_line1="123 Test St",
            city="Test City",
            postcode="12345",
            latitude=Decimal('51.5074'),
            longitude=Decimal('-0.1278')
        )
        self.service_type = ServiceType.objects.create(name="Test Service", description="Test Description")
        self.service_request = ServiceRequest.objects.create(
            created_by=self.regular_user,
            service_request_item=self.service_type,
            building=self.building
        )

    def test_list_service_requests(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('service-request-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), ServiceRequest.objects.count())

    def test_list_service_requests_unauthorized(self):
        response = self.client.get(reverse('service-request-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_service_request(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
            "service_request_item": self.service_type.id,
            "building": self.building.id
        }
        response = self.client.post(reverse('service-request-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_service_request_missing_fields(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
        }
        response = self.client.post(reverse('service-request-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('service_request_item', response.data)
        self.assertIn('building', response.data)

    def test_update_status(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {"status": "in_progress"}
        response = self.client.patch(reverse('service-request-update-status', kwargs={'pk': self.service_request.id}), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'in_progress')

    def test_update_status_with_invalid_status(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {"status": "invalid_status"}
        response = self.client.patch(reverse('service-request-update-status', kwargs={'pk': self.service_request.id}), data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        self.assertIn('status', response.data)
        self.assertEqual(response.data['status'][0], '"invalid_status" is not a valid choice.')

    def test_fetch_service_request_without_building_access(self):
        self.client.force_authenticate(user=self.regular_user)
        another_building = Building.objects.create(
            name="Another Building",
            address_line1="456 Another St",
            city="Another City",
            postcode="67890",
            latitude=Decimal('51.5094'),
            longitude=Decimal('-0.1338')
        )

        service_request_without_access = ServiceRequest.objects.create(
            created_by=self.admin_user,
            service_request_item=self.service_type,
            building=another_building
        )
        response = self.client.get(reverse('service-request-detail', kwargs={'pk': service_request_without_access.id}))
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)