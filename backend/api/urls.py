from django.urls import path
from .views import ProductListCreate, ProductRetrieveUpdateDelete

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDelete.as_view(), name='product-detail'),
]