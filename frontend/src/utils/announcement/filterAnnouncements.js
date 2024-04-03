/* Returns an array of filtered announcements.
   Parameters:
    announcementArray: array of announcement dicts
    search_term: string, MUST be upper case in order to work. */
const filterAnnouncements = (
  announcementArray,
  search_term
  ) => 
{
  let result = announcementArray;

  /* Only filter if there are announcements and a search term, otherwise
      just return the announcements that were passed in */
  if (announcementArray && search_term) {
    result = announcementArray.filter( (announcement_obj) => {
      const re = new RegExp(search_term, "g");
      const formattedDateString = new Date(
        announcement_obj.created_datetime.split('T')[0]
      ).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});

      /* First see if the search term matches any announcement data; bodytext may be null */
      if (
        re.test(announcement_obj.title.toUpperCase()) ||
        (announcement_obj.bodytext && re.test(announcement_obj.bodytext.toUpperCase())) ||
        (formattedDateString && re.test(formattedDateString.toUpperCase()))
        )
      {
        return true;
      } 

      return false;
    });
  }

  return result;
};

export default filterAnnouncements;