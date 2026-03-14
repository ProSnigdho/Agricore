from django.urls import path
from .views import CropListCreateView, CropDetailView

urlpatterns = [
    path('', CropListCreateView.as_view(), name='crop-list-create'),
    path('<int:pk>/', CropDetailView.as_view(), name='crop-detail'),
]
