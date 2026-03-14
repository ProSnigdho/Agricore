import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': response.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class GoogleLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                audience=client_id
            )
            
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
                'role': 'Customer'
            })
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            
        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.role != 'Admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Admin access only.")
        return super().get_queryset()

class AdminStatsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'Admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Admin access only.")
            
        from livestock.models import Livestock
        from notices.models import Notice
        
        return Response({
            "total_users": User.objects.count(),
            "active_customers": User.objects.filter(role='Customer').count(),
            "total_livestock": Livestock.objects.count(),
            "total_notices": Notice.objects.count(),
            "system_health": "99.9%",
            "performance_nodes": [40, 70, 45, 90, 65, 80, 55, 95, 75, 85]
        })
