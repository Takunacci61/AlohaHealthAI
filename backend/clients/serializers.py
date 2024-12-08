from rest_framework import serializers
from datetime import date
from .models import CareClient, ClientNote
import openai
from django.conf import settings
import json
import logging

# Set up logger
logger = logging.getLogger(__name__)

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
        read_only_fields = ['id', 'created_at', 'updated_at', 'assigned_caregiver']

    def validate_date_of_birth(self, value):
        """
        Validate that the date of birth is not in the future.
        """
        if value > date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            # Set the currently logged-in user as the assigned caregiver
            validated_data['assigned_caregiver'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            # Update the assigned caregiver to the currently logged-in user
            validated_data['assigned_caregiver'] = request.user
        return super().update(instance, validated_data)


class ClientNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientNote
        fields = '__all__'
        read_only_fields = ['sentiment', 'emotion_tags','ai_evaluated_notes', 'created_at', 'created_by']

    def analyze_sentiment(self, note_text):
        openai.api_key = settings.OPEN_AI_API
        # If you're using a custom endpoint (e.g., Azure OpenAI), set openai.api_base:
        # openai.api_base = settings.OPEN_AI_BASE_URL

        prompt = (
            "You are a sentiment analysis system. "
            "Return exactly one of these words: Positive, Negative, or Neutral. "
            "Do not include any additional text or punctuation.\n\n"
            f"Text: \"{note_text}\""
        )

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )

            if (not completion or
                    not completion.choices or
                    not completion.choices[0].message or
                    not completion.choices[0].message.content):
                raise ValueError("Invalid response from OpenAI API for sentiment analysis.")

            sentiment_response = completion.choices[0].message.content.strip()
            # Note: The model choices are:
            # Positive, Neutral, Negative, Uncategorised
            # We'll map the model's response directly to these keys:
            sentiment_mapping = {
                "Positive": "Positive",
                "Negative": "Negative",
                "Neutral": "Neutral"
            }

            return sentiment_mapping.get(sentiment_response, "Uncategorised")
        except Exception as e:
            logger.error(f"Sentiment analysis error: {str(e)}", exc_info=True)
            return "Uncategorised"

    def analyze_emotions(self, note_text):
        openai.api_key = settings.OPEN_AI_API
        # If using a custom endpoint (like Azure), uncomment and set:
        # openai.api_base = settings.OPEN_AI_BASE_URL

        # We provide a list of mental health related emotions as a guide.
        # The model should return them if found, along with their scores.
        prompt = (
            "You are a system that identifies mental-health-related emotions in a given text. "
            "Return only a valid JSON object with double-quoted keys and numeric values between 0 and 1. "
            "Keys should be emotion names (strings), and values should be their associated intensity scores. "
            "Only include emotions relevant to mental health if they are present in the text. "
            "If no mental-health-related emotions are found, return an empty JSON object `{}`.\n\n"
            "Some examples of mental-health-related emotions are: \"sadness\", \"anxiety\", \"depression\", \"fear\", "
            "\"stress\", \"hopelessness\", \"worry\", \"loneliness\", \"shame\", \"guilt\", \"anger\", \"helplessness\".\n\n"
            "Analyze the following text:\n"
            f"\"{note_text}\"\n\n"
            "Example Output:\n"
            "{\"anxiety\": 0.8, \"sadness\": 0.2}\n\n"
            "Now produce only the JSON object (no extra text):"
        )

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,  # More deterministic output
                max_tokens=200
            )

            if not completion or not completion.choices or not completion.choices[0].message:
                raise ValueError("Invalid response from OpenAI API for emotion analysis.")

            emotion_response = completion.choices[0].message.content.strip()
            logger.debug(f"Emotion analysis response: {emotion_response}")

            # Validate if response looks like JSON
            if not (emotion_response.startswith("{") and emotion_response.endswith("}")):
                logger.error(f"Emotion analysis returned non-JSON format: {emotion_response}")
                return {}

            # Attempt to parse JSON
            emotion_tags = json.loads(emotion_response)

            # Validate and clamp scores
            validated_tags = {}
            for emotion, score in emotion_tags.items():
                try:
                    float_score = float(score)
                    if 0 <= float_score <= 1:
                        validated_tags[emotion] = float_score
                    else:
                        logger.warning(f"Score out of range for emotion '{emotion}': {score}")
                except (TypeError, ValueError):
                    logger.warning(f"Invalid score for emotion '{emotion}': {score}")
                    # Skip invalid scores

            return validated_tags
        except json.JSONDecodeError as jde:
            logger.error(f"JSON decode error: {str(jde)}. Response was: {emotion_response}", exc_info=True)
            return {}
        except Exception as e:
            logger.error(f"Emotion analysis error: {str(e)}", exc_info=True)
            return {}

    def evaluate_for_safeguarding(self, note_text):
        openai.api_key = settings.OPEN_AI_API

        prompt = (
            "You are acting as a safeguarding officer. Read the following care note carefully and "
            "identify all potential risks to the patient’s well-being, such as signs of abuse, neglect, "
            "self-harm, unmet care needs, or environmental hazards. Then provide a list of suggestions "
            "for safeguarding actions that could be taken to protect the patient. "
            "Present your answer in plain text, clearly separating the identified risks and the suggested "
            "safeguarding measures.\n\n"
            f"Care Note: \"{note_text}\""
        )

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )

            safeguarding_response = completion.choices[0].message.content.strip()
            return safeguarding_response
        except Exception as e:
            logger.error(f"Safeguarding analysis error: {str(e)}", exc_info=True)
            return "Unable to analyze safeguarding risks at this time."

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['created_by'] = request.user

        note_text = validated_data.get('note_text', '')
        validated_data['sentiment'] = self.analyze_sentiment(note_text)
        validated_data['ai_evaluated_notes'] = self.evaluate_for_safeguarding(note_text)
        validated_data['emotion_tags'] = self.analyze_emotions(note_text)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'note_text' in validated_data:
            note_text = validated_data['note_text']
            instance.sentiment = self.analyze_sentiment(note_text)
            instance.emotion_tags = self.analyze_emotions(note_text)
            instance.ai_evaluated_notes = self.evaluate_for_safeguarding(note_text)


        return super().update(instance, validated_data)

