from django.contrib import admin
from .models import CareClient, ClientNote

@admin.register(CareClient)
class CareClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'age', 'care_status', 'assigned_caregiver', 'created_at')
    search_fields = ('first_name', 'last_name', 'assigned_caregiver__username')


@admin.register(ClientNote)
class ClientNoteAdmin(admin.ModelAdmin):
    list_display = ('care_client', 'created_by', 'created_at', 'sentiment')
    search_fields = ('care_client__first_name', 'care_client__last_name', 'note_text')
    list_filter = ('sentiment', 'created_at')
