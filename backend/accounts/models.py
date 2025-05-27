from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Login(AbstractUser):
    is_customer = models.BooleanField(default=False)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name} (ID: {self.id})"

    
    

   


class Product(models.Model):
    # Product model to represent the products in the shop
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    stock = models.IntegerField()

    def __str__(self):
        return f"{self.name} (ID: {self.id})"


class CartItem(models.Model):
    user = models.ForeignKey(Login,on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user} (ID: {self.id})"
        



# models.py
class Order(models.Model):
    user = models.ForeignKey(Login, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price at time of order

    def __str__(self):
        return f"{self.order} (ID: {self.id})"

    

    

    
     
