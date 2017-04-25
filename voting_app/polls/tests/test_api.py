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

        self.user1 = User.objects.create_user(
            username = "testuser1",
            email = "test1@test.com",
            password = "testuser"
        )

        self.question1 = Question.objects.create(
            author = self.user,
            question_text="Who let the dogs out?"
        )

        self.question2 = Question.objects.create(
            author = self.user1,
            question_text="And my second question is?"
        )

        self.choice1question1 = Choice.objects.create(
            question = self.question1,
            choice_text = "Me",
        )

        self.choice2question1 = Choice.objects.create(
            question = self.question1,
            choice_text = "You",
        )

    def login(self):
        self.client.login(
            username="testuser",
            password="testuser",
        )


    def vote(self):
        post_data = {
            'question': self.question1.id,
            'choice': self.choice1question1.id
        }

        response = self.client.post(
            '/api/v1/polls/1/vote/', 
            data=post_data,
            format='json'
        )
        return response

    def vote_and_test(self):
        
        response = self.vote()

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
        return vote

    def create_new_poll(self):
        post_data = {
            "question_text": "Test me?",
            "choices": [
                {"choice_text": "test1"},
                {"choice_text": "test2"}
            ]
        }

        response = self.client.post(
            '/api/v1/polls/', 
            data=post_data,
            format='json'
        )

        return response

    def update_poll(self):
        question = Question.objects.first()

        put_data = {
            'question_text': 'Question title updated?',
            'choices': [
                {'choice_text': 'New choice'}
            ]
        }

        response = self.client.put(
            '/api/v1/polls/{}/'.format(question.id), 
            put_data,
            format='json'
        )
        return response

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
        self.vote_and_test()

    def test_vote_user_logged_in(self):
        """
        Test if logged in user can vote.
        """
        self.client.login(
            username="testuser",
            password="testuser",
        )

        vote = self.vote_and_test()

        self.assertEqual(vote.vote_author, self.user)

    def test_cant_vote_again(self):
        """
        Test that user can't vote again for the same question
        """
        self.login()

        vote = self.vote_and_test()

        response = self.vote()

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {
                'detail': 'You already voted.'
            })

    def test_mypolls_forbidden_if_not_authenticated(self):
        """
        Test if my polls returns 403 if not logged in
        """
        response = self.client.get('/api/v1/polls/mypolls/')
        self.assertEqual(response.status_code, 403)

    def test_mypolls(self):
        """
        Test if my polls returns a list of my polls only
        """
        self.login()
        response = self.client.get('/api/v1/polls/mypolls/')
        self.assertEqual(response.status_code, 200)
        with self.assertRaises(IndexError):
            response.data[1]

    def test_create_new_poll(self):
        """
        Test if we can create a new poll
        """
        self.login()
        response = self.create_new_poll()

        self.assertEqual(response.data, "New Question created")
        question = Question.objects.latest('id')
        choices = Choice.objects.filter(question=question)
        self.assertEqual(question.id, 3)
        self.assertEqual(question.question_text, "Test me?")
        self.assertEqual(len(choices), 2)

    def test_cant_create_new_poll_if_not_authenticated(self):
        """
        Test if we cant create a new poll if not authenticated
        """
        response = self.create_new_poll()
        self.assertEqual(response.status_code, 403)
        
    def test_update_poll(self):
        """
        Test if we can update the poll. We should update only the question text
        and have ability to add new choice. Existing choices can not be edited.
        """
        self.login()

        response = self.update_poll()

        self.assertEqual(response.data['question_text'], 'Question title updated?')
        self.assertEqual(response.data['choices'][2]['choice_text'], 'New choice')

    def test_cant_update_poll_if_not_authenticated(self):

        response = self.update_poll()
        self.assertEqual(response.status_code, 403)

    def test_cant_update_others_polls(self):

        self.login()

        question = Question.objects.latest('id')

        put_data = {
            'question_text': 'Question title updated?',
            'choices': [
                {'choice_text': 'New choice'}
            ]
        }

        response = self.client.put(
            '/api/v1/polls/{}/'.format(question.id), 
            put_data,
            format='json'
        )

        self.assertEqual(response.status_code, 403)


