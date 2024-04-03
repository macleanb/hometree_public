/* Returns true if formData elements equal emptyAnnouncementData,
   otherwise false */
const announcementDataIsEmpty = (formData) => {
  if (formData) {
    if (!('title' in formData) || (formData.title !== '')) {
      return false;
    }

    if (!('bodytext' in formData) || (formData.bodytext !== '')) {
      return false;
    }

    if (!('image' in formData) || (formData.image !== null)) {
      return false;
    }

    if (!('imageFileName' in formData) || (formData.imageFileName !== '')) {
      return false;
    }

    if (!('deleteExistingImage' in formData) || (formData.deleteExistingImage !== false)) {
      return false;
    }

    if (!('backendImageExists' in formData) || (formData.backendImageExists !== false)) {
      return false;
    }
    return true;
  }
};

export default announcementDataIsEmpty;