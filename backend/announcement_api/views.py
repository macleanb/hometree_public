from django.http import QueryDict
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.settings import api_settings
from rest_framework.permissions import DjangoModelPermissions
from rest_framework import status
from rest_framework.response import Response

from .models import Announcement
from .serializers import AnnouncementSerializer
from .permissions import AnnouncementPermissions


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    This class automates views for Announcement objects
    """
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES, DjangoModelPermissions, AnnouncementPermissions]

    # Overrides standard create() method to set the fk_Author
    # to the authenticated user id and created_datetime to 
    # now, regardless of data passed in for those fields
    def create(self, request, *args, **kwargs):
        """
        Overrides create method for creating Announcement objects
        """
        user_id = request.user.id

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

            if user_id:
                request.data['fk_Author'] = user_id
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            # Forces default value of timezone.now
            request.data['created_datetime'] = timezone.now()

        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, *args, **kwargs):
        """
        Overrides create method for updating Announcement objects
        """
        user_id = request.user.id
        instance = self.get_object()

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

            if user_id:
                request.data['fk_Author'] = user_id
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Forces the value to the current value, if a user
            # was trying to overwrite it
            request.data['created_datetime'] = instance.created_datetime

        partial = True
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(AnnouncementSerializer(instance).data)