from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.settings import api_settings
from .models import Address
from .serializers import AddressSerializer
from .permissions import AddressPermissions

class AddressViewSet(viewsets.ModelViewSet):
    """
    This class automates views for Address objects
    """
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, AddressPermissions]
