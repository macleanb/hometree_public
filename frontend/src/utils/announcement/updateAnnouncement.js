////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import getAnnouncementValidationErrors from './getAnnouncementValidationErrors';
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';
import getURL_Announcement from './getURL_Announcement';


const updateAnnouncement = async (
  auth,
  announcementIDToUpdate,
  formData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{  
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ANNOUNCEMENT)) {
    try {
      /* Handle any blank fields on the frontend rather than sending problems to server */
      const validationErrors = getAnnouncementValidationErrors(formData);
  
      if (!validationErrors) {
        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();

        if (formData) {
          form_data.append("title", formData.title);

          if (formData.bodytext) { // may be blank
            form_data.append("bodytext", formData.bodytext);
          }

          if (formData.image && formData.imageFileName.length > 0) {
            form_data.append("image", formData.image, formData.imageFileName);
          } else if (formData.deleteExistingImage) {
            form_data.append("image", '');
          }
        }
        
        if (csrfToken && client) {
          const response = await client.patch(
            getURL_Announcement(announcementIDToUpdate),
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': `Announcement updated successfully.`});
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
    setFrontEndErrors({Error: "You don't have permission to update that announcement."});
    return null;
  }
};

export default updateAnnouncement;