from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal
from requestAPI.models import Building, ServiceType, ServiceRequest, Update

class ModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.building = Building.objects.create(
            name="Test Building",
            address_line1="123 Test St",
            city="Test City",
            postcode="12345",
            latitude=Decimal('51.5074'),
            longitude=Decimal('-0.1278')
        )
        self.service_type = ServiceType.objects.create(
            name="Test Service",
            description="Test Description"
        )
        self.service_request = ServiceRequest.objects.create(
            created_by=self.user,
            service_request_item=self.service_type,
            building=self.building
        )

    def test_building_str(self):
        self.assertEqual(str(self.building), "Test Building - 123 Test St, None, Test City, 12345, United Kingdom")

    def test_service_type_str(self):
        self.assertEqual(str(self.service_type), "Test Service")

    def test_service_request_str(self):
        self.assertEqual(str(self.service_request), "open")

    def test_service_request_sla_date(self):
        self.assertIsNotNone(self.service_request.service_level_agreement_date)

    def test_update_creation(self):
        update = Update.objects.create(
            title="Test Update",
            message="Test Message",
            created_by=self.user,
            service_request=self.service_request
        )
        self.assertEqual(str(update), f'Comment by testuser on Request {self.service_request.id}')