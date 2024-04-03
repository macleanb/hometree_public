from .models import HOAUser_Residence, Residence
from rest_framework import serializers
from django.apps import apps


# class AnnouncementSerializer(serializers.ModelSerializer):
#     """
#     Serializer for Announcement class
#     """
#     image = serializers.ImageField(max_length=None, allow_empty_file=True, allow_null=True, required=False)

#     class Meta:
#         """
#         Meta settings to the Announcement serializer class
#         """
#         model = Announcement
#         fields = '__all__'


class ResidenceSerializer(serializers.ModelSerializer):
    """
    Serializer for Residence class
    """
    class Meta:
        """
        Meta settings to the Residence serializer class
        """
        model = Residence
        fields = '__all__'


class HOAUserResidenceSerializer(serializers.ModelSerializer):
    """
    Serializer for HOAUser_Residence class
    """
    class Meta:
        """
        Meta settings to the HOAUser_Residence serializer class
        """
        model = HOAUser_Residence
        fields = '__all__'
