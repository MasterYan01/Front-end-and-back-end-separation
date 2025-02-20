# backend/api/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Product  # 導入 Product
from .serializers import RegisterSerializer, ProductSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated

# 登入視圖
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# 註冊視圖
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializer.data,
            "message": "註冊成功"
        }, status=status.HTTP_201_CREATED)

# 產品視圖
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()  # queryset 在這裏定義
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class ProductRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()  # queryset 在這裏定義
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]