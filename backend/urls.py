from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from passwords.views import SecretViewSet, RegisterView # 👈 Import RegisterView
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'secrets', SecretViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-token-auth/', obtain_auth_token),
    path('api/register/', RegisterView.as_view(), name='auth_register'), # 👈 New Route
]