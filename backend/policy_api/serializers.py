from rest_framework import serializers
from django.apps import apps

from .models import Policy, PolicyOption, ResidencePolicyChoice


class PolicySerializer(serializers.ModelSerializer):
    """
    Serializer for Policy class
    """
    image = serializers.ImageField(max_length=None, allow_empty_file=True, allow_null=True, required=False)

    class Meta:
        """
        Meta settings to the Policy serializer class
        """
        model = Policy
        fields = '__all__'


class PolicyOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for PolicyOption class
    """

    class Meta:
        """
        Meta settings to the PolicyOption serializer class
        """
        model = PolicyOption
        fields = '__all__'


class ResidencePolicyChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for ResidencePolicyChoice class
    """

    class Meta:
        """
        Meta settings to the ResidencePolicyChoice serializer class
        """
        model = ResidencePolicyChoice
        fields = '__all__'
