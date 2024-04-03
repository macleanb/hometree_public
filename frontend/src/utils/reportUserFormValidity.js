import { getUserValidationErrors } from './userUtils';

/* Reports whether formData is valid, and returns
   a boolean indicating the validity.
   Inputs:
    - elementRefs: a ref object containing references to DOM elements
    - formData: a dict containing the submitted form data
   Output:
    - boolean: true if data is valid, false otherwise */
const reportUserFormValidity = (formData, elementRefs) => {
  let customValidity = true;

  /* Check for custom validation errors and report as needed. */
  if (formData && elementRefs) {
    const customValidationErrors = getUserValidationErrors(formData);

    if (customValidationErrors?.email) {
      customValidity = false;
    } else if (customValidationErrors?.password) {
      customValidity = false;
    } else if (customValidationErrors?.first_name) {
      customValidity = false;
    } else if (customValidationErrors?.last_name) {
      customValidity = false;
    }  else if (customValidationErrors?.general) {
      customValidity = false;
    }

    /* Set all custom validities to either the error string or empty string */
    elementRefs.inputEmailRef.current.setCustomValidity(
      customValidationErrors?.email ? customValidationErrors.email : 
        customValidationErrors?.general ? customValidationErrors.general : ''
    );

    elementRefs.inputPasswordRef.current.setCustomValidity(
      customValidationErrors?.password ? customValidationErrors.password : ''
    );

    elementRefs.inputFirstNameRef.current.setCustomValidity(
      customValidationErrors?.first_name ? customValidationErrors.first_name : ''
    );

    elementRefs.inputLastNameRef.current.setCustomValidity(
      customValidationErrors?.last_name ? customValidationErrors.last_name : ''
    );
  }


  /* If no custom errors were found, form could still be invalid based on
     built-in validation. */
  const form = document.getElementById("user-form");
  const builtInValidity = form.reportValidity();

  return customValidity && builtInValidity;
}

export default reportUserFormValidity;