from django.contrib.auth.models import User

from rest_framework.test import APITestCase

from polls.models import Question, Choice, Vote

class PollsAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username = "testuser",
            email = "test@test.com",
            password = "testuser"
        )
        self.question1 = Question.objects.create(
            author = self.user,
            question_text="Who let the dogs out?"
        )
        self.choice1question1 = Choice.objects.create(
            question = self.question1,
            choice_text = "Me",
        )
        self.choice2question1 = Choice.objects.create(
            question = self.question1,
            choice_text = "You",
        )

    def test_list_polls(self):
        """
        Test that we can get the list of polls
        """
        response = self.client.get('/api/v1/polls/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['question_text'],
                        'Who let the dogs out?')
        self.assertEqual(response.data[0]['choices'][0]['choice_text'], 'Me')

    def test_get_poll(self):
        """
        Test that we can get the single poll
        """
        response = self.client.get('/api/v1/polls/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['question_text'], 
                        'Who let the dogs out?')

    def test_poll_vote(self):
        """
        Test that we can vote
        """
        post_data = {
            'question': self.question1.id,
            'choice': self.choice1question1.id
        }

        response = self.client.post(
                        '/api/v1/polls/1/vote/', 
                        data=post_data,
                        format='json'
                    )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data'], {
                'question': 1,
                'choice': 1,
            })
        
        vote = Vote.objects.get(question=self.question1.id)
        choice = Choice.objects.get(id=self.choice1question1.id, question=self.question1)
        self.assertEqual(vote.question, self.question1)
        self.assertEqual(vote.voter_ip, '127.0.0.1')
        self.assertEqual(choice.vote, 1)
