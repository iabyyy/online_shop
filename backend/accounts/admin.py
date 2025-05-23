# accounts/admin.py
from django.contrib import admin 
from .models import Product, CartItem, Login, BuyProduct

# Register the models
admin.site.register(Login)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(BuyProduct)
