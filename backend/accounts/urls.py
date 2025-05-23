from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import user_registration, UserLogin, ProductViewSet, UserCart, AddToCartView

# Initialize the router
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
# router.register(r'cart', CartItemViewSet, basename='cart') 

urlpatterns = [
    path('user_registration',views.user_registration,name='user_registration'),
    path('UserLogin',views.UserLogin,name='UserLogin'),
    path('usercart/<int:id>/', views.UserCart.as_view()), 
    # path('cart/<int:id>/',views.CartItemView.as_view(),name='cart'),
    path("AddToCartView/",views.AddToCartView.as_view(),name='AddToCartView'),
    path('AddToCartView/<int:id>/', AddToCartView.as_view(), name='add_to_cart'),
    path("BuyProducts/",views.BuyProducts.as_view(),name='BuyProducts'),
    
    path('api/', include(router.urls)), 
]
