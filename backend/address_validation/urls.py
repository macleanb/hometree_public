from .views import AddressValidator
from django.urls import path

app_name = 'address_validation'

urlpatterns = [
    path('', AddressValidator.as_view(), name='validateaddress'),
]
