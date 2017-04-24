from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.decorators import detail_route, list_route
from ipware.ip import get_ip

# For twitter
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from rest_auth.views import LoginView
from rest_auth.social_serializers import TwitterLoginSerializer

from ..models import Question, Choice, Vote
from .serializers import QuestionSerializer, \
VoteSerializer
from .permissions import IsAuthenticatedCustom


class TwitterLogin(LoginView):
    """
    Twitter OAuth View/django-rest-auth
    """
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter

class PollsViewSet(viewsets.ModelViewSet):
    """
    Viewset that provides the standart actions for Polls
    """

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes=[IsAuthenticatedCustom, ]

    def create(self, request, *args, **kwargs):
        if not request.data['question_text']:
            return Response('You forgot to add a question')
        try:
            choices = request.data['choices']
        except:
            return Response('You forgot to add choices')
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            new_question = serializer.save(author = request.user)
        return Response('New Question created')


    # Individual user polls/questions
    @list_route(methods=['get'], 
                permission_classes=[IsAuthenticatedCustom,])
    def mypolls(self, request):
        question = Question.objects.filter(author=self.request.user)
        question_serialized = QuestionSerializer(question, many=True)
        return Response(question_serialized.data)

    @detail_route(methods=['get', 'post'], 
                serializer_class=VoteSerializer,
                permission_classes=[AllowAny,])
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
                try:
                    choice = Choice.objects.get(id=choicepk, question=questionpk)
                # 404
                except:
                    return Response({"detail": "Question doesnt have this choice."}, 
                                    status=status.HTTP_404_NOT_FOUND)

                #Check if the user/ip is voted before

                ip = get_ip(request)
                if request.user.is_authenticated:
                    user = request.user
                else:
                    user = None

                try:
                    vote = Vote.objects.get(
                        Q(question=questionpk),
                        Q(vote_author=user) | Q(voter_ip=ip)
                    )

                except Vote.DoesNotExist:
                    vote = None

                if vote:
                    return Response({"detail": "You already voted."},
                            status=status.HTTP_403_FORBIDDEN)
                else:
                    # Increase vote count
                    choice.vote += 1
                    choice.save() 
                    vote = Vote.objects.create(
                        question = question,
                        vote_author = user,
                        voter_ip = ip,
                        choice = choice
                    )

                return Response({'data': vote_serialized.data}) 