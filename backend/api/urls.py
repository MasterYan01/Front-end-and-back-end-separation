from django.urls import path
from .views import (
    ProductListCreate,
    ProductRetrieveUpdateDelete,
    CustomTokenObtainPairView,
    RegisterAPIView,
    # ----- 數據統計儀表板功能開始 -----
    StatsAPIView,
    # ----- 數據統計儀表板功能結束 -----
)

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDelete.as_view(), name='product-detail'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterAPIView.as_view(), name='register'),  # 新增註冊路由
    # ----- 數據統計儀表板功能開始 -----
    path('stats/', StatsAPIView.as_view(), name='stats'),
    # ----- 數據統計儀表板功能結束 -----
]