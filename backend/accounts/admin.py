# accounts/admin.py
from django.contrib import admin 
from .models import Product, CartItem, Login, OrderItem , Order

# Register the models
admin.site.register(Login)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(OrderItem)
admin.site.register(Order)
