from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# must override the throttle settings for tests to return correct error code 
# thought about moving them to the top of the throttle test (so i'll pass) but then im mixing concerns
# this isnt ideal but my later tests cover throttle so handles both scenarios

class AuthViewSetTests(TestCase):
    def setUp(self):
    
        self.client = APIClient()
        self.user_data = {
            "username": "testuser",
            "email": "testuser@test.com",
            "password": "testpass123",
            "password2": "testpass123"
        }
        self.existing_user = User.objects.create_user(
            username='existinguser', email='existinguser@test.com', password='existingpass123'
        )

    def test_register(self):
        response = self.client.post(reverse('auth-register'), self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_existing_username(self):
        user_data = {
            "username": "existinguser",  
            "email": "newemail@test.com",
            "password": "newpass123",
            "password2": "newpass123"
        }
        response = self.client.post(reverse('auth-register'), user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data['details'])

    def test_register_with_existing_email(self):
        user_data = {
            "username": "newuser",
            "email": "existinguser@test.com",
            "password": "newpass123",
            "password2": "newpass123"
        }
        response = self.client.post(reverse('auth-register'), user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data['details'])

    def test_register_with_mismatched_passwords(self):
        user_data = {
            "username": "testuser2",
            "email": "testuser2@test.com",
            "password": "testpass123",
            "password2": "wrongpass123"
        }
        response = self.client.post(reverse('auth-register'), user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password2", response.data['details']) 

    def test_login(self):
        User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        response = self.client.post(reverse('auth-login'), {
            "username": "testuser",
            "password": "testpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_with_invalid_credentials(self):
        response = self.client.post(reverse('auth-login'), {
            "username": "wronguser",
            "password": "wrongpass"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_logout(self):
        user = User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        refresh = RefreshToken.for_user(user)
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse('auth-logout'), {"refresh": str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_password(self):
        user = User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse('auth-update-password'), {
            "current_password": "testpass123",
            "new_password1": "newtestpass123",
            "new_password2": "newtestpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()
        self.assertTrue(user.check_password("newtestpass123"))
    
    def test_update_password_with_wrong_current_password(self):
        user = User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse('auth-update-password'), {
            "current_password": "wrongpassword",
            "new_password1": "newtestpass123",
            "new_password2": "newtestpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_update_password_with_mismatched_new_passwords(self):
        user = User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse('auth-update-password'), {
            "current_password": "testpass123",
            "new_password1": "newtestpass123",
            "new_password2": "wrongnewpassword"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("details", response.data)
        self.assertIn("new_password2", response.data["details"])

    def test_refresh_token(self):
        user = User.objects.create_user(username='testuser', email='testuser@test.com', password='testpass123')
        refresh = RefreshToken.for_user(user)
        response = self.client.post(reverse('auth-refresh-token'), {"refresh": str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_refresh_token_without_token(self):
        response = self.client.post(reverse('auth-refresh-token'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Refresh token not provided")

    def test_refresh_token_with_invalid_token(self):
        response = self.client.post(reverse('auth-refresh-token'), {"refresh": "invalid_token"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid refresh token")

    def test_cannot_get_new_access_token_with_blacklisted_refresh(self):
        response = self.client.post(reverse('auth-login'), {
            "username": "existinguser",
            "password": "existingpass123"
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data)
        refresh_token = response.data['refresh']

        refresh = RefreshToken(refresh_token)
        refresh.blacklist()

        invalid_refresh_response = self.client.post(reverse('auth-refresh-token'), {"refresh": refresh_token})

        self.assertEqual(invalid_refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(invalid_refresh_response.data["error"], "Invalid refresh token")
