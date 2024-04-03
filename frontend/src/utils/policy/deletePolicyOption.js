/* Internal Libraries */
import getURL_PolicyOption from './getURL_PolicyOption';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';


const deletePolicyOption = async (
  auth,
  policyID,
  policyOptionID,
  setFrontEndErrors,
  setBackEndErrors
) => {
  if(Number.isInteger(policyID) && Number.isInteger(policyID) && userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_POLICY)) {
    try {
      const csrfToken = getCSRFToken();
      const client = getClient();
      const URL = getURL_PolicyOption(policyID, policyOptionID);
      
      if (csrfToken && client) {
        const response = await client.delete(
          URL,
          {
            headers: { 'Content-Type': 'multipart/form-data',
                      "X-CSRFToken": csrfToken
            },
            withCredentials: true
          }
        );

        return await response?.data;
      } else {
        throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error));
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to delete that policy option."});
    return null;
  }
  };

  export default deletePolicyOption;