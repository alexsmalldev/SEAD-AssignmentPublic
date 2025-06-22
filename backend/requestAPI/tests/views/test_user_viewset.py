from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class UserViewSetTests(TestCase):
    def setUp(self):

        self.client = APIClient()
        User.objects.all().delete()
        self.admin_user = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.regular_user = User.objects.create_user('regular', 'regular@test.com', 'regularpass')

    def test_list_users(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), User.objects.count())

    def test_list_users_unauthorized(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    


    def test_create_user(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "newuserpass",
            "password2": "newuserpass"
        }
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        data = {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "newuserpass",
            "password2": "newuserpass"
        }
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user_passwords_do_not_match(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "username": "newuser",
            "email": "newuser@test.com",
            "password": "newuserpass",
            "password2": "wrongpassword"
        }
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password2', response.data)
        self.assertEqual(response.data['password2'][0], "Password fields didn't match.")

    def test_create_user_with_existing_username(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "username": "regular",
            "email": "newemail@test.com",
            "password": "newuserpass",
            "password2": "newuserpass"
        }
        response = self.client.post(reverse('user-list'), data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], "A user with that username already exists.")

    def test_me_endpoint(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(reverse('user-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'regular')

    def test_bulk_delete_without_user_ids(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(reverse('user-bulk-delete'), data={})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "No user IDs provided.")

    def test_assign_buildings_without_building_ids(self):
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.post(reverse('user-assign-buildings', kwargs={'pk': self.regular_user.id}), data={})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "No building IDs provided.")

    def test_assign_buildings_with_invalid_building(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "building_ids": [9999]
        }

        response = self.client.post(reverse('user-assign-buildings', kwargs={'pk': self.regular_user.id}), data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "One or more buildings do not exist.")

    def test_search_non_existent_user(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('user-list'), {'query': 'nonexistentuser'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_superusers_as_regular_user(self):
        self.client.force_authenticate(user=self.regular_user)
        
        response = self.client.get(reverse('user-superusers'))
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_update_user_with_existing_email(self):
        self.client.force_authenticate(user=self.regular_user)

        User.objects.create_user(username='anotheruser', email='regular@test.com', password='anotherpass')

        data = {
            "username": "TestUser",
            "first_name": "UpdatedFirst",
            "last_name": "UpdatedLast",
            "email": "regular@test.com"
        }
        response = self.client.put(reverse('user-me'), data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], "A user with that email already exists.")
