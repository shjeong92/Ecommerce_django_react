from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender, instance, **kwargs):
    user = instance 
    if user.email:
        user.username = user.email

# pre_save = save 되기 직전에 수행할함수 연결시켜주기.
pre_save.connect(updateUser, sender=User)