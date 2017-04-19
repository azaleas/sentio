from rest_framework import serializers
from ..models import Question, Choice


class ChoicesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['choice_text', 'vote']

class QuestionSerializer(serializers.ModelSerializer):

    choices = ChoicesSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['question_text', 'choices']