from rest_framework import serializers
from .models import Livestock

class LivestockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livestock
        fields = [
            'id', 'tag_id', 'breed', 'age_months', 'weight_kg', 
            'gender', 'color', 'is_insured', 'insurance_policy_number', 
            'insurance_expiry', 'health_status', 'last_vaccination_date', 
            'created_at', 'image'
        ]
        read_only_fields = ['id', 'created_at']
