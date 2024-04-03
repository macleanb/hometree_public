from django.http import QueryDict
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.settings import api_settings
from rest_framework.permissions import DjangoModelPermissions
from rest_framework import status
from rest_framework.response import Response

from .models import Policy, PolicyOption, ResidencePolicyChoice
from .serializers import PolicySerializer, PolicyOptionSerializer, ResidencePolicyChoiceSerializer
from .permissions import PolicyPermissions, PolicyOptionPermissions, ResidencePolicyChoicePermissions
from hoa_api.models import HOAUser_Residence, Residence
from hoa_api.serializers import ResidenceSerializer
from address_api.models import Address
from address_api.serializers import AddressSerializer


class PolicyViewSet(viewsets.ModelViewSet):
    """
    This class automates views for Policy objects
    """
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, PolicyPermissions]

    # Overrides standard create() method to set the fk_Author
    # to the authenticated user id, regardless of data passed in for that field
    def create(self, request, *args, **kwargs):
        """
        Overrides create method for creating Policy objects
        """
        user_id = request.user.id

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

            if user_id:
                request.data['fk_Author'] = user_id
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = PolicySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, *args, **kwargs):
        """
        Overrides create method for updating Policy objects
        """
        user_id = request.user.id
        instance = self.get_object()

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

            if user_id:
                request.data['fk_Author'] = user_id
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        partial = True
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(PolicySerializer(instance).data)


class PolicyOptionViewSet(viewsets.ModelViewSet):
    """
    This class automates views for PolicyOption objects
    """
    queryset = PolicyOption.objects.all()
    serializer_class = PolicyOptionSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, PolicyOptionPermissions]

    # Overrides standard list() method to only display policyoptions for
    # a specific policy_id
    def list(self, request, *args, **kwargs):
        """
        Overrides list method for updating PolicyObjet objects
        """

        if kwargs['policy_id'] is not None:
            policy_id = kwargs['policy_id']

            options_for_policy_id = PolicyOption.objects.filter(
                fk_Policy = policy_id
            )

            output = [PolicyOptionSerializer(policyoption_obj, context={"request": request}).data for policyoption_obj in options_for_policy_id]
            return Response(output)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    # Overrides standard create() method to only create policyoptions for
    # a specific policy_id provided in URL
    def create(self, request, *args, **kwargs):
        """
        Overrides create method for creating PolicyOption objects
        """
        if kwargs['policy_id'] is not None:
            policy_id = kwargs['policy_id']

            if policy_id and isinstance(request.data, QueryDict):
                request.data._mutable = True

                # swap whatever fk_Policy was provided in request.data
                # with policy_id
                request.data['fk_Policy'] = policy_id

                serializer = PolicyOptionSerializer(data=request.data)

                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ResidencePolicyChoiceViewSet(viewsets.ModelViewSet):
    """
    This class automates views for ResidencePolicyChoice objects
    """
    queryset = ResidencePolicyChoice.objects.all()
    serializer_class = ResidencePolicyChoiceSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, ResidencePolicyChoicePermissions]

    # Overrides standard list() method to only display ResidencePolicyChoices for
    # a specific policy_id
    def list(self, request, *args, **kwargs):
        """
        Overrides list method for listing ResidencePolicyChoice objects
        """

        if kwargs['policy_id'] is not None:
            policy_id = kwargs['policy_id']

            residencepolicychoices_for_policy_id = ResidencePolicyChoice.objects.filter(
                fk_Policy = policy_id
            )

            output = [ResidencePolicyChoiceSerializer(residencepolicychoice_obj, context={"request": request}).data for residencepolicychoice_obj in residencepolicychoices_for_policy_id]

            # Replace the fk_Residence with either:
            #   A Residence dict that has street as '(Address Redacted)' for all residencepolicychoices that have
            #   make_public false and request.user is not among the owners of the residence
            # OR
            #  A Residence dict with an address that has all fields filled out
            for residencepolicychoice_serialized in output:
                # Serialize the fk_PolicyOption instead of just returning the policy_option id
                policy_option = PolicyOption.objects.get(pk=residencepolicychoice_serialized['fk_PolicyOption'])
                policy_option_serialized = PolicyOptionSerializer(policy_option).data

                # Serialize the fk_Residence instead of just returning the residence id
                residence_id = residencepolicychoice_serialized['fk_Residence']
                residence = Residence.objects.get(pk=residence_id)
                residence_serialized = ResidenceSerializer(residence).data

                # Serialize the fk_Address in fk_Residence instead of just returning the address id
                address_id = residence_serialized['fk_Address']
                address = Address.objects.get(pk=address_id)
                address_serialized = AddressSerializer(address).data

                # Redact the street in address if required
                if residencepolicychoice_serialized['make_public'] is False:
                    residence_owner_record = HOAUser_Residence.objects.filter(
                        fk_Residence=residence_id,
                        fk_HOAUser = request.user.id
                    ).first()

                    if residence_owner_record is None:
                        # request.user doesn't own the residence
                        address_serialized['id'] = -1
                        address_serialized['street'] = '(Address Redacted)'
                        address_serialized['image'] = None
                        residence_serialized['id'] = -1
                        residence_serialized['join_date'] = ''
                        residence_serialized['lat'] = -1.0
                        residence_serialized['lng'] = -1.0
                
                # Update the serialized residencepolicychoice
                residence_serialized['fk_Address'] = address_serialized
                residencepolicychoice_serialized['fk_Residence'] = residence_serialized
                residencepolicychoice_serialized['fk_PolicyOption'] = policy_option_serialized

            return Response(output)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    # Overrides standard retrieve() method to redact residence data and serialize all
    # data
    def retrieve(self, request, *args, **kwargs):
        """
        Overrides list method for retrieving ResidencePolicyChoice objects
        """

        if kwargs['pk'] is not None:
            residencepolicychoice_id = kwargs['pk']

            residencepolicychoice = ResidencePolicyChoice.objects.get(pk=residencepolicychoice_id)
            residencepolicychoice_serialized = ResidencePolicyChoiceSerializer(residencepolicychoice).data

            # Replace the fk_Residence with either:
            #   A Residence dict that has street as '(Address Redacted)' for all residencepolicychoices that have
            #   make_public false and request.user is not among the owners of the residence
            # OR
            #  A Residence dict with an address that has all fields filled out

            # Serialize the fk_PolicyOption instead of just returning the policy_option id
            policy_option = PolicyOption.objects.get(pk=residencepolicychoice_serialized['fk_PolicyOption'])
            policy_option_serialized = PolicyOptionSerializer(policy_option).data

            # Serialize the fk_Residence instead of just returning the residence id
            residence_id = residencepolicychoice_serialized['fk_Residence']
            residence = Residence.objects.get(pk=residence_id)
            residence_serialized = ResidenceSerializer(residence).data

            # Serialize the fk_Address in fk_Residence instead of just returning the address id
            address_id = residence_serialized['fk_Address']
            address = Address.objects.get(pk=address_id)
            address_serialized = AddressSerializer(address).data

            # Redact the street in address if required
            if residencepolicychoice_serialized['make_public'] == False:
                residence_owner_record = HOAUser_Residence.objects.filter(
                    fk_Residence=residence_id,
                    fk_HOAUser = request.user.id
                ).first()

                if residence_owner_record is None:
                    # request.user doesn't own the residence
                    address_serialized['id'] = -1
                    address_serialized['street'] = '(Address Redacted)'
                    address_serialized['image'] = None
                    residence_serialized['id'] = -1
                    residence_serialized['join_date'] = ''
                    residence_serialized['lat'] = -1.0
                    residence_serialized['lng'] = -1.0
                    
            
            # Update the serialized residencepolicychoice
            residence_serialized['fk_Address'] = address_serialized
            residencepolicychoice_serialized['fk_Residence'] = residence_serialized
            residencepolicychoice_serialized['fk_PolicyOption'] = policy_option_serialized

            return Response(residencepolicychoice_serialized)
        return Response(status=status.HTTP_400_BAD_REQUEST)