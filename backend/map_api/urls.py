from .views import Map
from django.urls import path

app_name = 'map_api'

urlpatterns = [
    path('', Map.as_view(), name='map'),
]
