from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)

# Swagger schema view configuration
schema_view = get_schema_view(
    openapi.Info(
        title="Care Project API",
        default_version="v1",
        description=(
            "API documentation for the Care Project. "
            "This includes endpoints for managing clients, notes, caregivers, and care analytics."
        ),
        terms_of_service="https://www.careproject.com/terms/",
        contact=openapi.Contact(email="support@careproject.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# URL patterns for the project
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/clients/', include('clients.urls')),
    path('api/accounts/', include('accounts.urls')),

    # Swagger and ReDoc endpoints
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

