////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import constants from '../../constants';
import getURL_Announcement from './getURL_Announcement';
import { getCSRFToken, getClient } from '../apiUtils';
import { getResponseError } from '../errorUtils';
import { userIsAuthorized } from '../authUtils';

/* Retrieves a single announcement from the backend server */
const getAnnouncementByID = async (auth, announcementID, setBackEndErrors) => {
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ANNOUNCEMENT)) {
    try {
        const announcementURL = getURL_Announcement(announcementID);
        const client = getClient();
        const response = await client.get(announcementURL);
        return await response?.data;

    } catch (e) {
        console.log(e);
        setBackEndErrors(getResponseError(e));
    }
  } else {
    setBackEndErrors({Error: "You don't have permission to retrieve that announcement."});
  }
};

export default getAnnouncementByID;