from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Product, CartItem, OrderItem
from .serializers import ProductSerializer, CartItemSerializer
from rest_framework import viewsets
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .forms import UserRegisterForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.models import Login





@csrf_exempt
# User Registration View
def user_registration(request):
    result_data = None
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_customer = True  
            user.save()
            result_data=True
    try:
        if result_data:
            data = {'result':True}       
        else:
            error_data = form.errors
            error_dict = {}
            for i in list(form.errors):
                error_dict[i] = error_data[i][0]
                data = {'result': False, 'errors': error_dict}
    except:
        data={
            'result':False
        }            
    
    return JsonResponse(data, safe=False)


# User Login View
@csrf_exempt
def UserLogin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if not username or not password:
            return JsonResponse({'status': False, 'result': 'Username and password are required'}, status=400)
        user = authenticate(request, username=username, password=password)
        print(user.id)

        if user is not None:
            login(request, user)
            data = {
                'status': True,
                'result': 'Login successful',
                'username': user.username,
                'user_id': user.id  
            }
        else:
            data = {
                'status': False,
                'result': 'Invalid username or password'
            }

        return JsonResponse(data)

    return JsonResponse({'status': False, 'result': 'Invalid request method'}, status=400)



class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
   



# class CartItemViewSet(viewsets.ModelViewSet):
#     queryset = CartItem.objects.all()
#     serializer_class = CartItemSerializer



# class CartItemView(APIView):
#     def get(self, request, id):
#         cart_items = CartItem.objects.filter(user=id)
#         serializer = CartItemSerializer(cart_items, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
















from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Login, Product, CartItem
from .serializers import CartItemSerializer



class AddToCartView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        if not user_id or not product_id:
            return Response({"error": "user_id and product_id are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = Login.objects.get(id=user_id)
            product = Product.objects.get(id=product_id)
        except Login.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        cart_item = CartItem.objects.create(user=user, product=product, quantity=quantity)
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Handle GET request to fetch cart items for a user
    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = CartItem.objects.filter(user=user_id)
    
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Handle PUT request to update cart item
    def put(self, request,id):
        try:
            cart_item = CartItem.objects.get(id=id)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate quantity
        quantity = request.data.get('quantity')
        if quantity and (not isinstance(quantity, int) or quantity <= 0):
            return Response({"error": "Quantity must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)

        # Update cart item details (e.g., quantity)
        cart_item.quantity = quantity if quantity else cart_item.quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)







class UserCart(APIView):
    def get(self, request, id):
        cart_items = CartItem.objects.filter(user=id)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)


    def post(self, request, id):
        try:
            cart_item = CartItem.objects.get(id=id)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=404)

        serializer = CartItemSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    def put(self, request, id):
        try:
            cart_item = CartItem.objects.get(id=id)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=404)

        serializer = CartItemSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    def delete(self, request, id):
        try:
            cart_item = CartItem.objects.get(id=id)
            cart_item.delete()
            return Response({"message": "Item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND) 

    




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Login, Product, CartItem, Order, OrderItem
from .serializers import OrderSerializer  # You would need to define this

class OrderView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Login.objects.get(id=user_id)
        except Login.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        cart_items = CartItem.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart_items)
        order = Order.objects.create(user=user, total_price=total_price)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear the user's cart
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def get(self, request, id):  # accept the id here
        try:
            user = Login.objects.get(id=id)
        except Login.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        orders = Order.objects.filter(user=user)
        if not orders.exists():
            return Response({"error": "No orders found for this user."}, status=status.HTTP_404_NOT_FOUND)

        ordered_products = []
        for order in orders:
            order_items = OrderItem.objects.filter(order=order)
            for item in order_items:
                ordered_products.append({
                    "order_id": order.id,
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "product_image": request.build_absolute_uri(item.product.image.url),
                    "quantity": item.quantity,
                    "price": item.price,
                    "order_date": order.created_at
                })

        return Response({"ordered_products": ordered_products}, status=status.HTTP_200_OK)







