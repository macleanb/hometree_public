""" Views for external weather_api app """
# External Imports
from django.http import JsonResponse
from django.template.loader import render_to_string
from rest_framework.settings import api_settings
from rest_framework.views import APIView
import base64
import googlemaps

# Internal Imports
from hoa_project.settings import GOOGLE_MAPS_API_KEY

class Map(APIView):
    """
    View to return weather data from Google Maps API.
    Reference: https://github.com/googlemaps/google-maps-services-python/blob/master/tests/test_maps.py
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES]
    def post(self, request):
        """
        Return map DOM element
        """
        API_KEY = GOOGLE_MAPS_API_KEY

        client = googlemaps.Client(API_KEY)

        center_lat = request.data['center_lat']
        center_lng = request.data['center_lng']
        zoom_level = request.data['zoom_level']
        residence_lat_lngs = request.data['residence_lat_lngs']
        cleaned_residence_lat_longs = []
        for res in residence_lat_lngs:
            if res['lat'] is not None and res['lng'] is not None:
                cleaned_residence_lat_longs.append(res)

        markers = [
            googlemaps.maps.StaticMapMarker(
                locations=[(res['lat'], res['lng'])], color="0x427B01", label="S", size="tiny"
            )
            for res in cleaned_residence_lat_longs
        ]

        response = client.static_map(
            size=(400, 400),
            zoom=zoom_level,
            center=(center_lat, center_lng),
            maptype="roadmap",
            format="png",
            scale=2,
            markers=markers
        )

        # Create a local image file to hold the image data
        # This is necessary to decode the data and provide
        # to template in <img> element
        file = open('map.png', 'wb')
        for byte_value in response:
            file.write(byte_value)
        file.close()

        encoded_str = ''
        decoded_str = ''
        with open("map.png", "rb") as image:
            f = image.read()
            encoded_str = base64.b64encode(f)
            decoded_str = decoded_str + encoded_str.decode()

        rendered_string = render_to_string(
            template_name='template.html',
            context={"image_data" : decoded_str, "image_description" : "a google map"},
            request=request
        )

        return JsonResponse(
            {
                'html' : rendered_string
            }
        )
