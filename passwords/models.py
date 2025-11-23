from django.db import models


# Create your models here.
from django.contrib.auth.models import User

class Secret(models.Model):
    # Link the secret to a specific user (so I can't see your passwords!)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="secrets")
    
    # A readable name so you know what this is (e.g. "Facebook")
    name = models.CharField(max_length=255)
    
    # The Blue String! (The encrypted data + nonce)
    ciphertext = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"