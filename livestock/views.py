from rest_framework import generics, permissions
from .models import Livestock
from .serializers import LivestockSerializer

class LivestockListCreateView(generics.ListCreateAPIView):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Owners can only see their own livestock
        return Livestock.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class LivestockDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Owners can only access their own livestock
        return Livestock.objects.filter(owner=self.request.user)
