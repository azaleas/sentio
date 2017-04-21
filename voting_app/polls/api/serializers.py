from rest_framework import serializers
from ..models import Question, Choice, Vote


class ChoicesSerializerWithVote(serializers.ModelSerializer):

    choice_id = serializers.ModelField(
                    model_field=Choice()._meta.get_field('id'),
                    required=False
                )

    class Meta:
        model = Choice
        fields = ['choice_id', 'choice_text', 'vote']


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

    def update(self, instance, validated_data):
        choices = validated_data['choices']
        instance.question_text = validated_data['question_text']
        instance.save()
        # Only create new choices, dont update existing ones
        for choice in choices:
            try:
                choice_id = choice['choice_id']
            except:
                Choice.objects.create(
                    question = instance,
                    choice_text = choice['choice_text']
                )
        return instance

class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = ['question', 'choice',]
