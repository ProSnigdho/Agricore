from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import RegisterView, UserProfileView, GoogleLoginView, UserListView, AdminStatsView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('login/google/', GoogleLoginView.as_view(), name='google_login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('admin/users/', UserListView.as_view(), name='admin_users'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]
