const getAnnouncementValidationErrors = (formData) => {
  let result = null;

  if (!formData) {
    result = { general: `Error: announcement data is invalid.` };
  } else if (formData.title === '') {
    result = { title: `missing title` };
  }

  return result;
};

export default getAnnouncementValidationErrors;