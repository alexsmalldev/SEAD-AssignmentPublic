from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from decimal import Decimal
from requestAPI.models import Building, ServiceType, ServiceRequest, Update
from django.utils import timezone

class UpdateViewSetTests(TestCase):
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
        self.update = Update.objects.create(
            title="Test Update",
            message="Test Message",
            created_by=self.regular_user,
            service_request=self.service_request,
            associated_to=self.regular_user
        )

    def test_list_updates(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('update-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Update.objects.count())

    def test_list_updates_unauthorized(self):
        response = self.client.get(reverse('update-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_update(self):
        self.client.force_authenticate(user=self.admin_user)

        data = {
            'service_request': self.service_request.id,
            'message': 'This is a test message',
            'type': 'message'
        }

        response = self.client.post(reverse('update-list'), data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        update = Update.objects.get(service_request=self.service_request, message='This is a test message')

        self.assertEqual(update.created_by, self.admin_user)
        self.assertEqual(update.associated_to, self.service_request.created_by)
        self.assertEqual(update.type, 'message') 
        self.assertEqual(update.message, 'This is a test message')

    def test_create_update_with_missing_fields(self):
        self.client.force_authenticate(user=self.regular_user)

        data = {
            'title': 'service_id_missing'
        }

        response = self.client.post(reverse('update-list'), data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('service_request', response.data)


    def test_create_update_with_nonexistent_service_request(self):
        self.client.force_authenticate(user=self.regular_user)

        data = {
            'service_request': 9999,
            'title': 'New Update Title',
            'message': 'This is a test message'
        }

        response = self.client.post(reverse('update-list'), data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('service_request', response.data)

    def test_mark_read(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(reverse('update-mark-read', kwargs={'id': self.update.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.update.refresh_from_db()   
        self.assertTrue(self.update.is_read)

    def test_mark_read_with_nonexistent_update(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.post(reverse('update-mark-read', kwargs={'id': 9999})) 
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_read_for_notification_not_owned(self):
        another_user = User.objects.create_user('another', 'another@test.com', 'anotherpass')
        self.client.force_authenticate(user=another_user)
        response = self.client.post(reverse('update-mark-read', kwargs={'id': self.update.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
