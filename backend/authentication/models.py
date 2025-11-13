from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('SUPERVISOR', 'Supervisor'),
        ('TECHNICIAN', 'Technician'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='TECHNICIAN')
    phone_number = models.CharField(max_length=15, blank=True)
    factory_location = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.username} ({self.role})"
