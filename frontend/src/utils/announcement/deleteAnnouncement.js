////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import { getCSRFToken, getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';
import { getResponseError } from '../errorUtils';
import getURL_Announcement from './getURL_Announcement';


const deleteAnnouncement = async (
  auth,
  announcementIDToDelete,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ANNOUNCEMENT)) {
    try {
      const csrfToken = getCSRFToken();
      const client = getClient();
      
      if (csrfToken && client) {
        const response = await client.delete(
          getURL_Announcement(announcementIDToDelete),
          {
            headers: { 'Content-Type': 'multipart/form-data',
                       "X-CSRFToken": csrfToken
            },
            withCredentials: true
          }
        );
        
        if (await response && response.status === 204) {
          setSuccessMessages({'Success': `Announcement deleted successfully.`});
        }

        return await response;
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
    setFrontEndErrors({Error: "You don't have permission to delete that announcement."});
    return null;
  }
};

export default deleteAnnouncement;