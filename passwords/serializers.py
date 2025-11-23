from rest_framework import serializers
from .models import Secret
from django.contrib.auth.models import User

# 👇 Add this class for Registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# (Your existing SecretSerializer should already be here below)
class SecretSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secret
        fields = ['id', 'name', 'ciphertext', 'created_at']