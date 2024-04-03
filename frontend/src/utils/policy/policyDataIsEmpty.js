/* Returns true if formData elements equal emptyPolicyData,
   otherwise false */
const policyDataIsEmpty = (formData) => {
  if (formData) {
    if (!('statement' in formData) || (formData.statement !== '')) {
      return false;
    }

    if (!('question' in formData) || (formData.question !== '')) {
      return false;
    }

    if (!('description' in formData) || (formData.description !== '')) {
      return false;
    }

    if (!('effective_date' in formData) || (formData.effective_date !== '')) {
      return false;
    }

    if (!('options' in formData) || (formData.options !== null)) {
      return false;
    }

    if (!('option_text' in formData) || (formData.option_text !== '')) {
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

export default policyDataIsEmpty;