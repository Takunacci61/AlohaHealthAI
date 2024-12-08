from django.db import models
from datetime import date
from django.utils.timezone import now
from django.contrib.auth.models import User

# Models choices ************************************************************
class GenderChoices(models.TextChoices):
    MALE = 'Male', 'Male'
    FEMALE = 'Female', 'Female'
    OTHER = 'Other', 'Other'


class CareStatusChoices(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    INACTIVE = 'Inactive', 'Inactive'
    UNDER_REVIEW = 'Under Review', 'Under Review'


class NoteSentimentChoices(models.TextChoices):
    POSITIVE = 'Positive', 'Positive'
    NEUTRAL = 'Neutral', 'Neutral'
    NEGATIVE = 'Negative', 'Negative'
    UNCATEGORISED = 'Uncategorised', 'Uncategorised'

# End Models choices ***********************************************************

# Client information ***********************************************************

class CareClient(models.Model):
    # Basic Information
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GenderChoices.choices)
    address = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)

    # Health and Care Information
    care_notes = models.TextField(blank=True, null=True, help_text="Additional notes on care requirements.")
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_number = models.CharField(max_length=15, blank=True, null=True)

    # Status and Tracking
    care_status = models.CharField(max_length=20, choices=CareStatusChoices.choices, default=CareStatusChoices.ACTIVE)
    assigned_caregiver = models.ForeignKey(User,  on_delete=models.SET_NULL,null=True,blank=True,related_name='care_clients',)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """String representation of the CareClient."""
        return f"{self.first_name} {self.last_name} ({self.care_status})"

    @property
    def age(self):
        """Calculate the current age of the care client."""
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None

    class Meta:
        verbose_name = "Care Client"
        verbose_name_plural = "Care Clients"
        ordering = ['last_name', 'first_name']

# End Client information ***********************************************************

# Client Notes *********************************************************************

class ClientNote(models.Model):
    care_client = models.ForeignKey(CareClient,on_delete=models.CASCADE, related_name='notes',help_text="The care client this note is associated with.")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, help_text="The care worker who created this note.")
    created_at = models.DateTimeField(default=now, editable=False, help_text="Timestamp when the note was created.")
    note_text = models.TextField(help_text="The content of the care note.")
    ai_evaluated_notes = models.TextField(blank=True, null=True, help_text="The AI evaluated notes.")
    sentiment = models.CharField(max_length=20, choices=NoteSentimentChoices.choices, default=NoteSentimentChoices.UNCATEGORISED, help_text="The sentiment of the note (e.g., Positive, Neutral, Negative, Uncategorised).")
    emotion_tags = models.JSONField(blank=True, null=True, help_text="Tags for emotions detected in the note (e.g., {'happiness': 0.8, 'anxiety': 0.2}).")

    def __str__(self):
        return f"Note for {self.care_client} by {self.created_by} on {self.created_at:%Y-%m-%d}"

    class Meta:
        verbose_name = "Client Note"
        verbose_name_plural = "Client Notes"
        ordering = ['-created_at']
