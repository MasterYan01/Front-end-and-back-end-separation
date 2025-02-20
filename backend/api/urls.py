from django.urls import path
from .views import (
    ProductListCreate,
    ProductRetrieveUpdateDelete,
    CustomTokenObtainPairView,
    RegisterAPIView
)

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDelete.as_view(), name='product-detail'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterAPIView.as_view(), name='register'),  # 新增註冊路由
]