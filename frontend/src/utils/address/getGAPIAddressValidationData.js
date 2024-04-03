/* Internal Imports */
import { getClient, getCSRFToken } from '../apiUtils';
import { getResponseError } from '../errorUtils';
import getURL_AddressValidation from './getURL_AddressValidation';

/* Sends an address to Google Address Validation API and returns the 
   response */
const getGAPIAddressValidationData = async (
  addrData,
  previousResponseId,
  setBackEndErrors
  ) =>
{
  try {
    const address = {
      "regionCode": "US",
      "locality": addrData.city,
      "administrativeArea": addrData.addr_state,
      "postalCode": addrData.zipcode.toString(),
      "addressLines": [addrData.street + ' ' + (addrData.street_2 ? addrData.street_2 : '')]
    };
  
    const request = {
      "address": address,
      "enableUspsCass": true
    }
  
    if (previousResponseId) {
      request['previousResponseId'] = previousResponseId;
    };
  
    const client = getClient();
    const csrfToken = getCSRFToken();

    const response = await client.post(
      getURL_AddressValidation(),
      request,
      {
        headers: { 
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    setBackEndErrors(getResponseError(error));
  }
}

export default getGAPIAddressValidationData;