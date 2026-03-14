from django.urls import path
from .views import LivestockListCreateView, LivestockDetailView

urlpatterns = [
    path('', LivestockListCreateView.as_view(), name='livestock-list-create'),
    path('<int:pk>/', LivestockDetailView.as_view(), name='livestock-detail'),
]
