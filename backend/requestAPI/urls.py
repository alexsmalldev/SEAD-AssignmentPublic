from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
import os

from .views import home
from .api.views.auth_views import *
from .api.views.dashboard_views import *
from .api.views.user_details_views import *
from .api.views.building_views import *
from .api.views.service_type_views import *
from .api.views.service_request_views import *
from .api.views.update_views import *

from rest_framework.routers import DefaultRouter

# URLS can be accessed through the ViewSet Action method name instead of providing a path, a lot cleaner that definine paths
router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'buildings', BuildingViewSet, basename='building')
router.register(r'service-types', ServiceTypeViewSet, basename='service-types')
router.register(r'service-requests', ServiceRequestViewSet, basename='service-request')
router.register(r'updates', UpdateViewSet, basename='update')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', home),
    
]

# If dev build media url from local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)