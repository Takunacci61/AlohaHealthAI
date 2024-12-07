from rest_framework import serializers
from datetime import date
from .models import CareClient, ClientNote

class CareClientSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()  # Include the age property as a read-only field

    class Meta:
        model = CareClient
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 'age', 'gender',
            'address', 'contact_number', 'care_notes', 'emergency_contact_name',
            'emergency_contact_number', 'care_status', 'assigned_caregiver',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_date_of_birth(self, value):
        """
        Validate that the date of birth is not in the future.
        """
        if value > date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

class ClientNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientNote
        fields = '__all__'  # You can customize fields as needed
