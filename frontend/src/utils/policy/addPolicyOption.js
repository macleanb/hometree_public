/* Internal Libraries */
import getPolicyOptionValidationErrors from './getPolicyOptionValidationErrors';
import getURL_PolicyOptions from './getURL_PolicyOptions';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';


const addPolicyOption = async (
  auth,
  option,
  policyID,
  setFrontEndErrors,
  setBackEndErrors
) => {
  if(option && Number.isInteger(policyID) && userIsAuthorized(auth, constants.PERMISSIONS_CAN_ADD_POLICY)) {
    try {
      /* Handle any blank fields on the frontend rather than sending problems to server. */
      const validationErrors = getPolicyOptionValidationErrors(option);

      if (!validationErrors) { 

        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();
        const URL = getURL_PolicyOptions(policyID);

        form_data.append("option_text", option.option_text);
        form_data.append("fk_Policy", policyID);
        
        if (csrfToken && client) {
          const response = await client.post(
            URL,
            form_data,
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
      }  else {
        setBackEndErrors(validationErrors);
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error));
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to add that policy option."});
    return null;
  }
  };

  export default addPolicyOption;