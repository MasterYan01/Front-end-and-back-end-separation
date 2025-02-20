from django.urls import path
from .views import ProductListCreate, ProductRetrieveUpdateDelete, CustomTokenObtainPairView

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDelete.as_view(), name='product-detail'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # 登入 API
]