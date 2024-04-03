/* Returns an announcement index from the allAnnouncementData array, if one
   has the ID that was passed in. Otherwise returns null.
   Parameters:
     announcementID: number 
     allAnnouncementData: array (with id field as number)
   Returns: announcement index (number) or null */
const getAnnouncementIdxFromAllAnnouncementDataArr = (announcementID, allAnnouncementData) => {
  if (announcementID && allAnnouncementData) {
    for (const i in allAnnouncementData) {
      
      /* See if the ID of the current announcement object matches the ID that was passed in. */
      const announcement_obj = allAnnouncementData[i];

      if (announcementID === announcement_obj.id) {
        return i;
      }
    }
  }

  return null;
};

export default getAnnouncementIdxFromAllAnnouncementDataArr;