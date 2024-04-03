from .models import Address
from rest_framework import serializers


class AddressSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, allow_empty_file=True, allow_null=True, required=False)

    class Meta:
        model = Address
        fields = '__all__'
