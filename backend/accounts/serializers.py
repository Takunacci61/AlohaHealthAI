from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'date_of_birth', 'gender', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
