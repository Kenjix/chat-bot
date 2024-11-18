# models.py
from django.db import models
from django.contrib.auth.models import User

class ChatContext(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    context = models.TextField(default="")

    def __str__(self):
        return f"Contexto do Chat para {self.user.username}"

