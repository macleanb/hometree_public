""" Views for external address_validation app """
# External Imports
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.response import Response
import pprint
import requests

# Internal Imports
from hoa_project.settings import ADDRESS_VALIDATION_API_KEY

# This view was built from Google Maps API guides:
# https://github.com/googlemaps/google-maps-services-python
# https://developers.google.com/maps/documentation/address-validation/reference/rest/v1/TopLevel/validateAddress
# Test data:
# {
#   "address": {
#     "addressLines": ["1600 Amphitheature Pk"],
#     "regionCode": "US",
#     "locality": "Mountain View",
#     "administrativeArea" : "CA",
#     "postalCode" : 99999
#   },
#   "enableUspsCass": true
# }
class AddressValidator(APIView):
    """
    View to return google address validation data.
    """
    permission_classes = [*api_settings.DEFAULT_PERMISSION_CLASSES]

    def post(self, request):
        """
        Return validation data
        """
        API_KEY = ADDRESS_VALIDATION_API_KEY

        address_to_validate = request.data['address']
        enable_usps_cass = request.data['enableUspsCass']
        address_lines = address_to_validate['addressLines']

        # The Python Google Maps Client addressvalidation()
        # method doesn't recognize administrativeArea (state) and
        # postalCode (the way the JavaScript client does)
        # so here we just ignore them
        administrative_area = address_to_validate['administrativeArea']
        postal_code = address_to_validate['postalCode']

        # validation_result = gmaps.addressvalidation(
        #     address_lines,
        #     regionCode=address_to_validate['regionCode'],
        #     locality=address_to_validate['locality'],
        #     enableUspsCass=enable_usps_cass,
        # )

        data = {
            "address": {
                "regionCode": address_to_validate['regionCode'],
                "languageCode": 'en',
                "postalCode": postal_code,
                "administrativeArea": administrative_area,
                "locality": address_to_validate['locality'],
                "addressLines": address_lines
            }
        }

        validation_result = requests.post(f'https://addressvalidation.googleapis.com/v1:validateAddress?key={API_KEY}', json=data)
        cleaned_validation_result = validation_result.json()
        return Response({'result': cleaned_validation_result})
