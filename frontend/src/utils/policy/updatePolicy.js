////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import getPolicyValidationErrors from './getPolicyValidationErrors';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';
import getURL_Policy from './getURL_Policy';


const updatePolicy = async (
  auth,
  policyIDToUpdate,
  formData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{  
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_POLICY)) {
    try {
      /* Handle any blank fields on the frontend rather than sending problems to server */
      const validationErrors = getPolicyValidationErrors(formData);
  
      if (!validationErrors) {
        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();

        if (formData) {
          form_data.append("statement", formData.statement);
          form_data.append("question", formData.question);

          if (formData.description) { // may be blank
            form_data.append("description", formData.description);
          }

          form_data.append("effective_date", formData.effective_date);

          if (formData.image && formData.imageFileName) {
            form_data.append("image", formData.image, formData.imageFileName);
          }
        }
        
        if (csrfToken && client) {
          const response = await client.patch(
            getURL_Policy(policyIDToUpdate),
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': `Policy updated successfully.`});
          }

          return await response?.data;
        } else {
          throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
        }
      }  else {
        // Rely on built-in reportValidity() call in handleClick function
        // setFrontEndErrors(validationErrors);
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error));
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to update that policy."});
    return null;
  }
};

export default updatePolicy;