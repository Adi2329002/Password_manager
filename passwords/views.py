from rest_framework import viewsets, generics
from .models import Secret
from .serializers import SecretSerializer, UserSerializer # 👈 Import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated

# 👇 Add this View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Allow strangers to register
    serializer_class = UserSerializer

# (Your existing SecretViewSet)
class SecretViewSet(viewsets.ModelViewSet):
    queryset = Secret.objects.all()
    serializer_class = SecretSerializer
    permission_classes = (IsAuthenticated,) # Keep secrets locked

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user) # Link secret to the logged-in user
    
    def get_queryset(self):
        # Only return secrets belonging to the logged-in user
        return self.queryset.filter(owner=self.request.user)