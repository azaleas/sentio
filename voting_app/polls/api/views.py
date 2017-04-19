from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from ..models import Question, Choice 
from .serializers import QuestionSerializer

class PollsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset that provides the standart actions for Polls
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    