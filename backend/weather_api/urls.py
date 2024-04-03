from .views import Weather
from rest_framework.routers import DefaultRouter
from django.urls import path

app_name = 'weather_api'

urlpatterns = [
    path('', Weather.as_view(), name='weather'),
]
