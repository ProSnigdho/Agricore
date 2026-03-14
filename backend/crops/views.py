from rest_framework import generics, permissions
from .models import Crop
from .serializers import CropSerializer
from rest_framework.exceptions import PermissionDenied

class CropListCreateView(generics.ListCreateAPIView):
    serializer_class = CropSerializer

    def get_queryset(self):
        # সাধারণ ইউজার শুধু Available ফসল দেখবে
        if self.request.user.is_authenticated and self.request.user.role == 'Admin':
            return Crop.objects.all()
        return Crop.objects.filter(is_available=True)

    def perform_create(self, serializer):
        # শুধু Admin ফসল যোগ করতে পারবে
        if self.request.user.role != 'Admin':
            raise PermissionDenied("Only Admin can add crops.")
        serializer.save()

class CropDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer

    def get_permissions(self):
        # দেখা সবার জন্য (Available হলে), কিন্তু এডিট শুধু এডমিনের
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_update(self, serializer):
        if self.request.user.role != 'Admin':
            raise PermissionDenied("Only Admin can update crops.")
        serializer.save()
