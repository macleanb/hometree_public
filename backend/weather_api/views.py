""" Views for external weather_api app """
# External Imports
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

# Internal Imports
from hoa_project.settings import WEATHER_API_KEY

class Weather(APIView):
    """
    View to return weather data from OpenWeather API.
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES]

    def get(self, request):
        """
        Return some weather data
        """

        lat = 38.52
        lon = -89.98
        lang = 'en'
        units = 'imperial'
        API_KEY = WEATHER_API_KEY

        base_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units={units}&lang={lang}"

        try:
            response = requests.get(base_url, params={})
            results = response.json()
            temp = results['main']['temp']
        except Exception as e:
            print(f'An error occurred in weather api {e}')
            temp = 0
        return Response({'temp': temp})
