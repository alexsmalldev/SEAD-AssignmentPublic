from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from requestAPI.models import Building, ErrorLog

class BuildingViewSetTests(TestCase):
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
        self.building2 = Building.objects.create(
            name="B Building",
            address_line1="456 B St",
            city="B City",
            postcode="22222",
            latitude=Decimal('52.5074'),
            longitude=Decimal('-0.2278')
        )
        self.building3 = Building.objects.create(
            name="A Building",
            address_line1="789 A St",
            city="A City",
            postcode="33333",
            latitude=Decimal('53.5074'),
            longitude=Decimal('-0.3278')
        )
        self.building.users.add(self.regular_user)

    def test_error_log(self):
        # first test of all units, so quickly check error is logging correctly through custom exception handler
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('building-available-users', kwargs={'pk': self.building.pk}))
        self.assertEqual(ErrorLog.objects.count(), 1)

    def test_list_buildings(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('building-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Building.objects.count())

    def test_registration_list(self):
        response = self.client.get(reverse('building-registration-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_list_buildings_unauthorized(self):
        response = self.client.get(reverse('building-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_ordering_by_field_ascending(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('building-list'), {'ordering': 'name'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        names = [building['name'] for building in response.data]
        expected_order = ['A Building', 'B Building', 'Test Building']
        self.assertEqual(names, expected_order)

    def test_ordering_by_field_descending(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('building-list'), {'ordering': '-name'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        names = [building['name'] for building in response.data]
        expected_order = ['Test Building', 'B Building', 'A Building']
        self.assertEqual(names, expected_order)

    def test_ordering_by_multiple_fields_multiple_orders(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('building-list'), {'ordering': 'name,-city'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        names_and_cities = [(building['name'], building['city']) for building in response.data]
        expected_order = [
            ('A Building', 'A City'),
            ('B Building', 'B City'),
            ('Test Building', 'Test City')
        ]
        self.assertEqual(names_and_cities, expected_order)

    def test_create_building(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name": "New Building",
            "address_line1": "456 New St",
            "city": "New City",
            "postcode": "54321",
            "latitude": "52.5200",
            "longitude": "13.4050"
        }
        response = self.client.post(reverse('building-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_building_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
            "name": "New Building",
            "address_line1": "456 New St",
            "city": "New City",
            "postcode": "54321",
            "latitude": "52.5200",
            "longitude": "13.4050"
        }
        response = self.client.post(reverse('building-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_building_with_missing_fields(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name": "Incomplete Building",
            "city": "Incomplete City"
        }
        response = self.client.post(reverse('building-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('address_line1', response.data)
        self.assertIn('postcode', response.data)
        self.assertIn('latitude', response.data)
        self.assertIn('longitude', response.data)

    def test_search_buildings(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('building-list'), {'search': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_search_building_with_no_results(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('building-list'), {'search': 'Nonexistent Building'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_building_users_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('building-users', kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_building_users_with_invalid_user_ids(self):
        self.client.force_authenticate(user=self.admin_user)
        invalid_user_ids = [9999, 8888]  # IDs that don't exist
        response = self.client.put(reverse('building-update-users', kwargs={'pk': self.building.pk}), {
            'user_ids': invalid_user_ids
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_get_available_users_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('building-available-users', kwargs={'pk': self.building.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)