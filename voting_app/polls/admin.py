from django.contrib import admin
from .models import Question, Choice, Vote

# Register your models here.

class ChoiceInline(admin.TabularInline):
    model = Choice
    raw_id_fields = ['question']

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['author', 'question_text', 'created_date']
    list_editable = ['question_text']
    list_filter = ['created_date', 'updated_date']
    inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)

class VoteAdmin(admin.ModelAdmin):
    list_display = ['question', 'vote_author', 'voter_ip', 'choice', 'created_date']
    list_filter = ['created_date']

admin.site.register(Vote, VoteAdmin)