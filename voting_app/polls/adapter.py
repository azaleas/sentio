from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.models import SocialToken

class AccountAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        request_data = request.GET
        user = request.user
        user_tokens = SocialToken.objects.get(
                        account__user=user, account__provider='twitter'
                    )
        user_oauth_token = user_tokens.token
        user_oauth_verifier = user_tokens.token_secret
        get_vars = "user_oauth_token=" + user_oauth_token \
                    + "&user_oauth_verifier=" + user_oauth_verifier \
                    + "&user=" + user.username
        path = "http://localhost:3000/twitter_logged_in?" + get_vars
        return path