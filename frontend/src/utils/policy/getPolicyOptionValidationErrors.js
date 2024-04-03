const getPolicyOptionValidationErrors = (option) => {
  let result = null;

  if (!option) {
    result = { general: `Error: option data is invalid.` };
  } else if (!option.option_text || option.option_text === '') {
    result = { option_text: `missing option text` };
  }

  return result;
};

export default getPolicyOptionValidationErrors;