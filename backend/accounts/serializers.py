from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, CartItem, Login, BuyProduct




class SignupSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ('name',)
        





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'


class BuyProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyProduct
        fields = '__all__'        
       