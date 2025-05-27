from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Login 

class UserRegisterForm(UserCreationForm):
    class Meta:
        model = Login
        fields = ('username',)

     
        