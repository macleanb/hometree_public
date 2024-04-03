import { getLoginValidationErrors } from './userUtils';

/* Reports whether login is valid, and returns
   a boolean indicating the validity.
   Inputs:
    - elementRefs: a ref object containing references to DOM elements
    - formData: a dict containing the submitted form data
   Output:
    - boolean: true if data is valid, false otherwise */
const reportLoginFormValidity = async (formData, elementRefs) => {
  let customValidity = true;

  /* Check for custom validation errors and report as needed. */
  if (formData && elementRefs) {
    const customValidationErrors = getLoginValidationErrors(formData);

    if (customValidationErrors?.email) {
      customValidity = false;
    } else if (customValidationErrors?.password) {
      customValidity = false;
    }

    /* Set all custom validities to either the error string or empty string */
    await elementRefs.inputEmailRef.current.setCustomValidity(
      customValidationErrors?.email ? customValidationErrors.email : 
        customValidationErrors?.general ? customValidationErrors.general : ''
    );

    await elementRefs.inputPasswordRef.current.setCustomValidity(
      customValidationErrors?.password ? customValidationErrors.password : ''
    );
  }
  
  /* If no custom errors were found, form could still be invalid based on
     built-in validation. */
  const form = document.getElementById("login-form");
  const builtInValidity = form.reportValidity();

  return customValidity && builtInValidity;
}

export default reportLoginFormValidity;