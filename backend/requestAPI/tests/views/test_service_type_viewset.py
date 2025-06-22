from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from requestAPI.models import ServiceType
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

class ServiceTypeViewSetTests(TestCase):
    def setUp(self):

        self.client = APIClient()
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.regular_user = User.objects.create_user('regular', 'regular@test.com', 'regularpass')
        self.service_type = ServiceType.objects.create(name="Test Service", description="Test Description")

    def test_list_service_types(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('service-types-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), ServiceType.objects.count())

    def test_list_service_types_unauthorized(self):
        response = self.client.get(reverse('service-types-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_service_type(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name": "New Service",
            "description": "New Description"
        }
        response = self.client.post(reverse('service-types-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_service_type_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
            "name": "Unauthorized Service",
            "description": "Regular users should not be able to create service types"
        }
        response = self.client.post(reverse('service-types-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_service_type_with_missing_fields(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "description": "Service type without a name"
        }
        response = self.client.post(reverse('service-types-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data) 

    def test_search_service_types_with_no_results(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('service-types-list'), {'search': 'Nonexistent Service'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
