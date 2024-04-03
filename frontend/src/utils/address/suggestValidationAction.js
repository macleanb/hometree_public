/* This module is only necessary to wrap the Google address validation
   import in a try/catch because Jest was failing to import.*/
const suggestValidationAction = async (validationData) => {

  /* Make sure data is valid */
  if (!validationData?.result?.result?.verdict) {
    throw new Error('Data provided to suggestValidationAction was incomplete or invalid.');
  }

  const response = validationData.result.result;

  let suggestedAction;
  if (response.verdict.hasUnconfirmedComponents) {
    suggestedAction = 'FIX';
  } else if (response.verdict.hasInferredComponents) {
    suggestedAction = 'CORRECT_SPELLING';
  } else {
    suggestedAction = 'ACCEPT';
  }

  const result = {
    suggestedAction: suggestedAction
  };

  return result;
};

export default suggestValidationAction;