from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone


class Building(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United Kingdom')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    users = models.ManyToManyField(User, related_name='buildings', blank=True)

    def __str__(self):
        return f"{self.name or 'Building'} - {self.address_line1}, {self.address_line2}, {self.city}, {self.postcode}, {self.country}"

class ServiceType(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    service_icon = models.ImageField(upload_to='service_icons/', blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ]

    customer_notes = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='low')
    created_date = models.DateTimeField(auto_now=True)
    updated_date = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_requests')
    service_request_item = models.ForeignKey('ServiceType', on_delete=models.CASCADE)
    building = models.ForeignKey('Building', on_delete=models.CASCADE)
    service_level_agreement_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.service_level_agreement_date:
            current_datetime = timezone.now()
            if self.priority == 'low':
                self.service_level_agreement_date = current_datetime + timedelta(days=5)
            elif self.priority == 'medium':
                self.service_level_agreement_date = current_datetime + timedelta(days=3)
            elif self.priority == 'high':
                self.service_level_agreement_date = current_datetime + timedelta(days=1)

        super(ServiceRequest, self).save(*args, **kwargs)

    def __str__(self):
        return self.status

class Update(models.Model):
    TYPE_CHOICES = [
        ('message', 'Message'),
        ('event', 'Event'),
    ]
    title = models.TextField(max_length=100, null=True, blank=True)
    message = models.TextField(max_length=255, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_updates')
    associated_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='associated_updates', null=True, blank=True)
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='updates')
    type = models.TextField(max_length=100, choices=TYPE_CHOICES, default='event')
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Comment by {self.created_by.username} on Request {self.service_request.id}'
    

class ErrorLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    endpoint = models.CharField(max_length=255)
    error_message = models.TextField()

    def __str__(self):
        return f"Error at {self.endpoint} on {self.timestamp}"

    
    


