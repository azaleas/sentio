from .base import *
 
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
TEMPLATE_DEBUG = False
 
# CHANGE THE ALLOWED_HOSTS LIST TO FIT YOUR NEEDS
ALLOWED_HOSTS = []
 
# Database

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret('SECRET_KEY', DEBUG)
 