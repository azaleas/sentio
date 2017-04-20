from rest_framework import serializers
from ..models import Question, Choice, Vote


class ChoicesSerializerWithVote(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['choice_text', 'vote']

class ChoicesSerializerWithoutVote(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['choice_text']

class QuestionSerializer(serializers.ModelSerializer):

    choices = ChoicesSerializerWithVote(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['question_text', 'choices']

class VoteSerializer(serializers.ModelSerializer):

    # question = QuestionSerializer()
    # choice = ChoicesSerializer()

    class Meta:
        model = Vote
        fields = ['question', 'choice',]
        # read_only = ['question', 'choice',]