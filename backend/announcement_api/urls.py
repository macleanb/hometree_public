from .views import AnnouncementViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path

app_name = 'announcement_api'

announcement_router = DefaultRouter()
announcement_router.register(r'', AnnouncementViewSet, basename='announcement_viewset')
urlpatterns = announcement_router.urls
