from django.test import TestCase
from django.contrib.auth.models import User
from requestAPI.models import Building, ServiceType, ServiceRequest
from requestAPI.serializers import (BuildingSerializer, ServiceTypeSerializer, 
                                    ServiceRequestSerializer, UpdateSerializer, UserSerializer)

class SerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        self.building_data = {
            'name': 'Test Building',
            'address_line1': '123 Test St',
            'city': 'Test City',
            'postcode': '12345',
            'latitude': '51.5074',
            'longitude': '-0.1278'
        }
        self.service_type_data = {
            'name': 'Test Service',
            'description': 'Test Description'
        }
        self.existing_user = User.objects.create_user(username="existinguser", email="existinguser@example.com", password="password123")
        self.building1 = Building.objects.create(name="Building 1", address_line1="123 Main St", city="City 1", postcode="12345", latitude="1", longitude="-1")
        self.building2 = Building.objects.create(name="Building 2", address_line1="456 Second St", city="City 2", postcode="67890", latitude="1", longitude="-1")

    def test_building_serializer(self):
        serializer = BuildingSerializer(data=self.building_data)
        self.assertTrue(serializer.is_valid())

    def test_service_type_serializer(self):
        serializer = ServiceTypeSerializer(data=self.service_type_data)
        self.assertTrue(serializer.is_valid())

    def test_service_request_serializer(self):
        user_data = {key: self.user_data[key] for key in self.user_data if key != 'password2'}
        user = User.objects.create_user(**user_data)
        building = Building.objects.create(**self.building_data)
        service_type = ServiceType.objects.create(**self.service_type_data)
        
        data = {
            'service_request_item': service_type.id,
            'building': building.id
        }
        serializer = ServiceRequestSerializer(data=data, context={'request': type('obj', (object,), {'user': user})})
        self.assertTrue(serializer.is_valid())

    def test_update_serializer(self):
        user_data = {key: self.user_data[key] for key in self.user_data if key != 'password2'}
        user = User.objects.create_user(**user_data)
        building = Building.objects.create(**self.building_data)
        service_type = ServiceType.objects.create(**self.service_type_data)
        service_request = ServiceRequest.objects.create(
            created_by=user,
            service_request_item=service_type,
            building=building
        )
        
        data = {
            'title': 'Test Update',
            'message': 'Test Message',
            'service_request': service_request.id
        }
        serializer = UpdateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_valid_user_serializer(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
            "first_name": "Test",
            "last_name": "User",
            "building_ids": [self.building1.id, self.building2.id]
        }

        serializer = UserSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors) 
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.username, data["username"])
        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.first_name, data["first_name"])
        self.assertEqual(user.last_name, data["last_name"])
        self.assertEqual(user.buildings.count(), 2)

    def test_missing_password(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "building_ids": [self.building1.id]
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

    def test_passwords_do_not_match(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strong_password123",
            "password2": "different_password",
            "building_ids": [self.building1.id]
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password2', serializer.errors)
        self.assertEqual(serializer.errors['password2'][0], "Password fields didn't match.")

    def test_existing_username(self):
        data = {
            "username": "existinguser", 
            "email": "newemail@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
            "building_ids": [self.building1.id]
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        self.assertEqual(serializer.errors['username'][0], "A user with that username already exists.")

    def test_existing_email(self):
        data = {
            "username": "newuser",
            "email": "existinguser@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
            "building_ids": [self.building1.id]
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertEqual(serializer.errors['email'][0], "Email is already taken.")

    def test_invalid_building_ids(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
            "building_ids": [999]
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('building_ids', serializer.errors)
        self.assertEqual(serializer.errors['building_ids'][0], "One or more buildings do not exist.")

    def test_update_user_serializer(self):
        data = {
            "first_name": "Updated",
            "last_name": "User",
            "password": "new_password123",
            "password2": "new_password123",
            "building_ids": [self.building1.id]
        }

        serializer = UserSerializer(instance=self.existing_user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()

        self.assertEqual(updated_user.first_name, "Updated")
        self.assertEqual(updated_user.buildings.count(), 1)
