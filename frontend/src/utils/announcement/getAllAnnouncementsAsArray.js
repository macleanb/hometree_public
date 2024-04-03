////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import { getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';

const getAllAnnouncementsAsArray = async (auth) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ANNOUNCEMENT)) {
    try {
      const client = getClient();

      const response = await client.get(constants.ANNOUNCEMENTS_URL);
        return await response?.data;
    } catch (e) {
        console.log(e);
    }
  }
};

export default getAllAnnouncementsAsArray;