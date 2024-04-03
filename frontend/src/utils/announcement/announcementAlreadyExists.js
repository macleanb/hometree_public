////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import getAllAnnouncementsAsArray from './getAllAnnouncementsAsArray';


/* Returns true if formData matches an existing announcement,
   otherwise false */
const announcementAlreadyExists = async (formData, auth) => {
  if (formData) {
    /* Fetch all announcement data as an array */
    const allAnnouncementsArray = await getAllAnnouncementsAsArray(auth);

    if (allAnnouncementsArray && allAnnouncementsArray.length > 0) {

      for (const announcement of allAnnouncementsArray) {
        if (('title' in formData) && ('title' in announcement) && (formData.title === announcement.title)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export default announcementAlreadyExists;