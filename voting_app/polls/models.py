from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Question(models.Model):
    author = models.ForeignKey(User, related_name='questions')
    question_text = models.CharField(max_length=300)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return self.question_text 

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    vote = models.PositiveIntegerField(db_index=True, default=0)

    class Meta:
        ordering = ['-vote']

    def __str__(self):
        return self.choice_text

class Vote(models.Model):
    question = models.ForeignKey(Question, related_name='votes', on_delete=models.CASCADE)
    vote_author = models.ForeignKey(User, related_name='votes', blank=True)
    voter_ip = models.GenericIPAddressField(blank=True, null=True, db_index=True)
    choice = models.ForeignKey(Choice, related_name='votes')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        index_together = [
            ["question", "vote_author"],
            ["question", "voter_ip"],
        ]
