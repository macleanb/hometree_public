from .models import Announcement
from rest_framework import serializers
from django.apps import apps


class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for Announcement class
    """
    image = serializers.ImageField(max_length=None, allow_empty_file=True, allow_null=True, required=False)

    class Meta:
        """
        Meta settings to the Announcement serializer class
        """
        model = Announcement
        fields = '__all__'
