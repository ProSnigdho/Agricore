from rest_framework import generics, permissions
from .models import Notice
from .serializers import NoticeSerializer

class NoticeListCreateView(generics.ListCreateAPIView):
    queryset = Notice.objects.all().order_by('-created_at')
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if self.request.user.role != 'Admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only Admin can create notices.")
        serializer.save()
