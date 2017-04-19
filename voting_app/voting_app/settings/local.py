from .base import *  # We import everything we have previously set up on base.py
 
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
 
ALLOWED_HOSTS = []
 
# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
 
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret('SECRET_KEY', DEBUG)
 
#########################################################
# Activate django-debug-toolbar if it is installed
#########################################################
try:
    import debug_toolbar
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware',]
    INSTALLED_APPS += ['debug_toolbar', ]
    def show_toolbar(request):
        return True
    DEBUG_TOOLBAR_CONFIG = {
        "SHOW_TOOLBAR_CALLBACK" : show_toolbar,
    }
except ImportError:
    pass
 
#########################################################
# Activate django-extensions if exist
#########################################################
try:
    import django_extensions
    INSTALLED_APPS += ['django_extensions', ]
except ImportError:
    pass
 
