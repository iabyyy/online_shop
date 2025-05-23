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
        



class BuyProduct(models.Model):
    cart = models.ForeignKey(CartItem,on_delete=models.CASCADE) 
    phone_no = models.CharField(max_length=10)
    address = models.TextField()     
