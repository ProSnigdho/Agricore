from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Customer', 'Customer'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='Customer')
    
    def __str__(self):
        return f"{self.username} - {self.role}"
