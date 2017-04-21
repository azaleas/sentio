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

    choices = ChoicesSerializerWithVote(many=True)

    class Meta:
        model = Question
        fields = ['question_text', 'choices']

    def create(self, validated_data):
        choices = validated_data.pop('choices')
        question = Question.objects.create(**validated_data)
        for choice in choices:
            Choice.objects.create(question=question, **choice)
        return question

class VoteSerializer(serializers.ModelSerializer):

    # question = QuestionSerializer()
    # choice = ChoicesSerializer()

    class Meta:
        model = Vote
        fields = ['question', 'choice',]
        # read_only = ['question', 'choice',]