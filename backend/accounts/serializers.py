from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, CartItem, Login ,OrderItem,Order




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

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()  # Adjust based on your Login model

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'total_price', 'items']    
       