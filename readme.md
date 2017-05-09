**Sentio - a Small Voting SPA, created using Django + ReactJS**
----------

Single Page Application experiment for poll creation, using Social authentication.

Built with:

 - **Django**
 - **Django-rest-framework**
 - **Django allauth + Django rest auth**
 - **React**
 - **Semantic UI**
 
For project overview and code details, see [here](https://azaleas.aerobatic.io/2017/05/07/sentio---a-voting-app/)

Hosted on [heroku](https://sentioapp.herokuapp.com).

For API endpoints, see [here](https://github.com/azaleas/sentio/blob/master/API.md).

For React readme, see [here](https://github.com/azaleas/sentio/blob/master/voting_app/frontend/README.md).

----------

For Local Setup:

 - Install requirements from requirements/local.txt
 - whitenoise can be uninstalled if it's not required (it's recommended for heroku). Also, clear up wsgi.py to avoid any issuse:
```
import os

from django.core.wsgi import get_wsgi_application

#Remove this
from whitenoise.django import DjangoWhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "voting_app.settings")

application = get_wsgi_application()

#Remove this
application = DjangoWhiteNoise(application)
```

 - Create a secrets.json file(rename secrets.json.example) and fill in the required keys and values.
 - Create a website in Django admin panel with proper url for twitter auth. Also add this url to hosts file.
 - Create new social application in Django admin for twitter. (See the docs of django-rest-auth for more details)
 - **adapter.py** inside polls application takes care of twitter redirect to React. **twitter_login_url** variable is imported from **variables.py**.  It:
     - should be "http://localhost:3000/twitter_logged_in" for local setup with webpack proxy.
     - should be "http://localhost:8000/twitter_logged_in" for local setup with react build completed.
     - should be "http://heroku_app_link/twitter_logged_in" for production.
 - **middleware.py** takes care of adding CORS headers for Webpack proxy.
 - FrontendAppView serves the index.html, from build folder of React app.
 - In react app, set the TWITTER_LOGIN_URL in utils/variables.js to "http://localdjangodomain.com:8000/auth/twitter/login/" {like "http://votingapp.com:8000/auth/twitter/login/"}

Production:

 - In react app, set the TWITTER_LOGIN_URL in utils/variables.js to "http://productionurl/auth/twitter/login/" {like "https://sentioapp.herokuapp.com/auth/twitter/login/"} and build the react project.
 - setup the python runtime in runtime.txt
 - **requirements.txt** takes care of production requirement installs. 
 - Create env variables in Heroku for variables listed in settings/production.py: EMAIL_USER, EMAIL_PASS, SECRET_KEY, DATABASE_URL.
 - Set DJANGO_SETTINGS_MODULE variable on heroku to voting_app.settings.production
 - add production url to ALLOWED_HOSTS.
 - Set ADMINS emails.
 - Add heroku domain as website domain in Django admin.
 - Create a social application in Django admin for twitter. (See the docs of django-rest-auth for more details)

Tests:

 - polls/tests - for DRF tests
 - frontend/src/tests - for React tests

Issues:

 - I used windows to build this and was getting Windows specific error on new twitter user creation. Right before redirection to React app I was receiving the error message, saying: "**ConnectionRefusedError: [WinError 10061] No connection could be made because the target machine actively refused it**". New user gets added though, and later login attempts go smooth. I thought this issue is coming because the smtp servers weren't set on local env. I also disabled the Email verification for users in django-allauth so that the application won't try to send any verification emails.