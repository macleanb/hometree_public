////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import getPolicyValidationErrors from './getPolicyValidationErrors';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';


const addPolicy = async (
  auth,
  formData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
) => {
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_ADD_POLICY)) {
    try {
      /* Handle any blank fields on the frontend rather than sending problems to server.
         // handleAddPolicyClicked reportValidity() should have reported already */
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
          const response = await client.post(
            constants.POLICIES_URL,
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': 'Policy added successfully.'});
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
    setFrontEndErrors({Error: "You don't have permission to add that policy."});
    return null;
  }
  };

  export default addPolicy;