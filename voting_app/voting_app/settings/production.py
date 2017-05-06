from .base import *
 
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
TEMPLATE_DEBUG = False
 
# CHANGE THE ALLOWED_HOSTS LIST TO FIT YOUR NEEDS
ALLOWED_HOSTS = ['.sentioapp.herokuapp.com', 'localhost', '127.0.0.1', '[::1]']

ADMINS = [('azaleas', 'azaleas@2die4.com')]

# Email
EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASS')
DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_USER')
SERVER_EMAIL = os.environ.get('EMAIL_USER')

# Database

# Heroku: Update database configuration from $DATABASE_URL.
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL')
    )
}
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')


SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

# LOGGING
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': "[%(asctime)s] [%(levelname)s] [%(name)s] [%(lineno)s] %(message)s",
            'datefmt': "%d/%m/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'assets_rotating_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'formatter': 'verbose',
            'filename': os.path.join(logsdir, 'assets.log'),
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 10,
        },
        'template_loader_rotating_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'formatter': 'verbose',
            'filename': os.path.join(logsdir, 'template_loader.log'),
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 10,
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'assets': {
            'handlers': ['assets_rotating_file'],
            'level': 'INFO',
        },
        'template_loader': {
            'handlers': ['template_loader_rotating_file'],
            'level': 'INFO',
        },
    }
}