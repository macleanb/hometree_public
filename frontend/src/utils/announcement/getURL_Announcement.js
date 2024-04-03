////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import constants from '../../constants';

const getURL_Announcement = (announcementID) => {
  let result = null;
  if (announcementID) {
    result = constants.ANNOUNCEMENTS_URL;
    result += announcementID + '/';
  }
  return result;
};

export default getURL_Announcement;