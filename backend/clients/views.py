from rest_framework import viewsets, permissions
from .serializers import CareClientSerializer,  ClientNoteSerializer
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count
from .models import CareClient, ClientNote
import openai
from django.conf import settings
import logging

# Set up logger
logger = logging.getLogger(__name__)

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



# End Client Notes *************************************************************

# Client Statistics *************************************************************

class ClientNoteDistributionAPIView(APIView):
    def get(self, request, client_id):
        care_client = get_object_or_404(CareClient, id=client_id)
        notes = ClientNote.objects.filter(care_client=care_client)

        # Sentiment Distribution
        sentiment_distribution = notes.values('sentiment').annotate(count=Count('sentiment'))

        # Emotion Distribution
        emotion_distribution = {}
        for note in notes:
            if note.emotion_tags:
                for emotion, value in note.emotion_tags.items():
                    if emotion in emotion_distribution:
                        emotion_distribution[emotion] += value
                    else:
                        emotion_distribution[emotion] = value

        # Normalize emotion distribution
        total_emotion_score = sum(emotion_distribution.values())
        if total_emotion_score > 0:
            emotion_distribution = {
                emotion: round(value / total_emotion_score, 2)
                for emotion, value in emotion_distribution.items()
            }

        # Analysis Summary
        analysis_summary = self.generate_analysis_summary(sentiment_distribution, emotion_distribution)

        return Response({
            'sentiment_distribution': list(sentiment_distribution),
            'emotion_distribution': emotion_distribution,
            'analysis_summary': analysis_summary,
        }, status=status.HTTP_200_OK)

    def generate_analysis_summary(self, sentiment_distribution, emotion_distribution):
        """
        Generates a summary analysis using OpenAI GPT model based on the sentiment
        and emotion distribution.
        """
        try:
            sentiment_data = ", ".join(
                [f"{item['sentiment']} ({item['count']} occurrences)" for item in sentiment_distribution]
            )
            emotion_data = ", ".join(
                [f"{emotion}: {score}" for emotion, score in emotion_distribution.items()]
            )

            prompt = (
                f"Based on the following patient data:\n\n"
                f"Sentiment Distribution: {sentiment_data}\n"
                f"Emotion Distribution: {emotion_data}\n\n"
                f"1. Provide a brief analysis of the patient's mental health.\n"
                f"2. Suggest actionable recommendations to support their mental well-being.\n\n"
                f"Be concise and professional in your response."
            )

            openai.api_key = settings.OPEN_AI_API
            response = openai.Completion.create(
                engine="gpt-4",
                prompt=prompt,
                max_tokens=200,
                temperature=0.7,
            )

            analysis_summary = response.choices[0].text.strip()
            return analysis_summary
        except Exception as e:
            logger.error(f"Error generating analysis summary: {str(e)}", exc_info=True)
            return "Unable to generate analysis summary at this time."