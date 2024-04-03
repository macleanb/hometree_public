////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import getAnnouncementValidationErrors from './getAnnouncementValidationErrors';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';


const addAnnouncement = async (
  auth,
  formData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
) => {
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_ADD_ANNOUNCEMENT)) {
    try {
      /* Handle any blank fields on the frontend rather than sending problems to server */
      const validationErrors = getAnnouncementValidationErrors(formData);

      if (!validationErrors) { // handleAddAnnouncementClicked reportValidity() should have reported

        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();

        if (formData) {
          form_data.append("title", formData.title);

          if (formData.bodytext) { // may be blank
            form_data.append("bodytext", formData.bodytext);
          }

          if (formData.image && formData.imageFileName) {
            form_data.append("image", formData.image, formData.imageFileName);
          }
        }
        
        if (csrfToken && client) {
          const response = await client.post(
            constants.ANNOUNCEMENTS_URL,
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': 'Announcement added successfully.'});
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
    setFrontEndErrors({Error: "You don't have permission to add that announcement."});
    return null;
  }
  };

  export default addAnnouncement;