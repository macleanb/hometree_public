const getPolicyValidationErrors = (formData) => {
  let result = null;

  if (!formData) {
    result = { general: `Error: policy data is invalid.` };
  } else if (formData.statement === '') {
    result = { statement: `missing policy statement` };
  } else if (formData.question === '') {
    result = { statement: `missing policy question` };
  }

  return result;
};

export default getPolicyValidationErrors;