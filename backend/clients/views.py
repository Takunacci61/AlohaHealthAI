from rest_framework import viewsets, permissions
from .serializers import CareClientSerializer,  ClientNoteSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ClientNote, CareClient


# Client information ***********************************************************

class CareClientViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing care client instances.
    """
    queryset = CareClient.objects.all()
    serializer_class = CareClientSerializer
    permission_classes = [permissions.IsAuthenticated]


# End Client information ***********************************************************

# Client Notes *********************************************************************

class ClientNoteViewSet(viewsets.ModelViewSet):
    queryset = ClientNote.objects.all()
    serializer_class = ClientNoteSerializer

    @action(detail=True, methods=['get'], url_path='notes')
    def client_notes(self, request, pk=None):
        """Retrieve all notes for a specific client."""
        try:
            care_client = CareClient.objects.get(pk=pk)
        except CareClient.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)

        notes = ClientNote.objects.filter(care_client=care_client)
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)
