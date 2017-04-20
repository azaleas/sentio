from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from ..models import Question, Choice 
from .serializers import QuestionSerializer, \
VoteSerializer, ChoicesSerializerWithVote, ChoicesSerializerWithoutVote

class PollsViewSet(viewsets.ModelViewSet):
    """
    Viewset that provides the standart actions for Polls
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


    @detail_route(methods=['get', 'post'], serializer_class=VoteSerializer)
    def vote(self, request, pk):
        """
        Vote for a given queastion
        """
        question = get_object_or_404(Question, id=pk)
        question_serialized = QuestionSerializer(question)
        if request.method == 'GET':
            data = {
                'question': question_serialized.data
            }
            return Response({'data': data})
        elif request.method == 'POST':
            vote_serialized = VoteSerializer(data=request.data)
            if vote_serialized.is_valid():
                choicepk = vote_serialized.data['choice']
                questionpk = vote_serialized.data['question']
                choice = get_object_or_404(Choice, id=choicepk, question=questionpk)
                if not choice:
                    return Response(choice)
                else:
                    choice.vote += 1
                    choice.save()
                return Response({'data': vote_serialized.data}) 