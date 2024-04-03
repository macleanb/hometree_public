from django.http import QueryDict
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.settings import api_settings
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import Residence, HOAUser_Residence
from .serializers import HOAUserResidenceSerializer, ResidenceSerializer
from users.serializer import UserSerializer
from .permissions import ResidencePermissions, HOAUser_ResidencePermissions



class ResidenceViewSet(viewsets.ModelViewSet):
    """
    This class automates views for Residence objects
    """
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, ResidencePermissions]


class UsersForResidenceView(APIView):
    """
    This class returns users for a given residence from HOAUser_Residence objects
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, HOAUser_ResidencePermissions]

    def get(self, request, residence_id):
        user_residences_for_residence_id = HOAUser_Residence.objects.filter(
            fk_Residence = residence_id
        )
        residence_users = [user_residence.fk_HOAUser for user_residence in user_residences_for_residence_id]
        output = [UserSerializer(user_obj, context={"request": request}).data for user_obj in residence_users]
        return Response(output)


    def post(self, request, residence_id):
        """
        Creating a new user for a given residence only requires a HOAUser id
        """
        # Append the residence_id to the request data
        #request.data['fk_Residence'] = residence_id
        # Reference: https://stackoverflow.com/questions/33861545/how-can-modify-request-data-in-django-rest-framework
        #request.data.update({'fk_Residence': residence_id})
        serializer = HOAUserResidenceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserForResidenceView(APIView):
    """
    This class is used to delete specific HOAUser_Residence objects
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, HOAUser_ResidencePermissions]

    def delete(self, request, residence_id, user_id):
        user_residence_for_residence_and_user_ids = HOAUser_Residence.objects.filter(
            fk_Residence = residence_id,
            fk_HOAUser = user_id
        ).first()

        if user_residence_for_residence_and_user_ids:
            user_residence_for_residence_and_user_ids.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AllUsersForAllResidencesView(APIView):
    """
    This class is meant to return a dictionary of residence IDs (as keys) and lists of owner IDs (as values)
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, HOAUser_ResidencePermissions]

    def get(self, request):
        output = {}
        residence_IDs = set()

        for HOAUser_Res in HOAUser_Residence.objects.all():
            residence_IDs.add(HOAUser_Res.fk_Residence.id)
        
        for residence_ID in residence_IDs:
            user_residences_for_residence_id = HOAUser_Residence.objects.filter(
                fk_Residence = residence_ID
            )
            output[residence_ID] = [user_residence.fk_HOAUser.id for user_residence in user_residences_for_residence_id]

        return Response(output)


class AllResidencesForAllUsersView(APIView):
    """
    This class is meant to return a dictionary of residence IDs (as keys) and lists of owner IDs (as values)
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, HOAUser_ResidencePermissions]

    def get(self, request):
        output = {}
        user_IDs = set()

        for HOAUser_Res in HOAUser_Residence.objects.all():
            if HOAUser_Res.fk_HOAUser:
                user_IDs.add(HOAUser_Res.fk_HOAUser.id)
        
        for user_ID in user_IDs:
            user_residences_for_user_id = HOAUser_Residence.objects.filter(
                fk_HOAUser = user_ID
            )
            output[user_ID] = [user_residence.fk_Residence.id for user_residence in user_residences_for_user_id]

        return Response(output)
