from django.db import models
from django.conf import settings

class Livestock(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
    )
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='livestocks')
    tag_id = models.CharField(max_length=50, unique=True, help_text="Unique Tag or Muzzle ID")
    breed = models.CharField(max_length=100)
    age_months = models.IntegerField()
    weight_kg = models.DecimalField(max_digits=7, decimal_places=2)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    color = models.CharField(max_length=50, blank=True)
    
    # Insurance info
    is_insured = models.BooleanField(default=False)
    insurance_policy_number = models.CharField(max_length=100, blank=True, null=True)
    insurance_expiry = models.DateField(blank=True, null=True)
    
    health_status = models.CharField(max_length=100, default='Healthy')
    last_vaccination_date = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='livestock_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.breed} ({self.tag_id}) - {self.owner.username}"
