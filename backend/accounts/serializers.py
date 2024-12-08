from rest_framework import serializers
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Call the superclass method to get the default token
        token = super().get_token(user)

        # Add custom claims
        token['user_id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user_id to the response data
        data['user_id'] = self.user.id
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'date_of_birth', 'gender', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
