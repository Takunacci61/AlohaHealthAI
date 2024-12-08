from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CareClientViewSet, ClientNoteViewSet,ClientNoteDistributionAPIView

router = DefaultRouter()
router.register('careclients', CareClientViewSet)
router.register('client-notes', ClientNoteViewSet, basename='client-notes')

urlpatterns = [
    path('', include(router.urls)),
    path('anaytics/client/<int:client_id>/note-distribution/', ClientNoteDistributionAPIView.as_view(), name='client_note_distribution'),
]
