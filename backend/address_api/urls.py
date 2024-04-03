from .views import AddressViewSet
from rest_framework.routers import DefaultRouter

app_name = 'address_api'

address_router = DefaultRouter()
#address_router.register(r'addresses', AddressViewSet, basename='address_viewset')
address_router.register(r'', AddressViewSet, basename='address_viewset')
urlpatterns = address_router.urls