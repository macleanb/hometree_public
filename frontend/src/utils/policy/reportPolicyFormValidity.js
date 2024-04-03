

/* Reports whether formData is valid, and returns
   a boolean indicating the validity.
   Inputs:
    - elementRefs: a ref object containing references to DOM elements
    - formData: a dict containing the submitted form data
   Output:
    - boolean: true if data is valid, false otherwise */
const reportPolicyFormValidity = async (formData, elementRefs, setBackEndErrors) => {
  let customValidity = true;

  /* Check for custom validation errors and report as needed. 
     As of now the function defaults to built-in form validation
     for requried fields.  The logic below is a placeholder in case
     additional validation is necessary on the front end.*/
//   if (formData && elementRefs) {
//     const customValidationErrors = getAnnouncementValidationErrors(formData);

//     if (customValidationErrors?.statement) {
//       customValidity = false;
//     } else if (customValidationErrors?.question) {
//       customValidity = false;
//     }

//     /* Set all custom validities to either the error string or empty string */
//     elementRefs.inputStatementRef.current.setCustomValidity(
//       customValidationErrors?.statement ? customValidationErrors.statement : ''
//     );

//     elementRefs.inputQuestionRef.current.setCustomValidity(
//       customValidationErrors?.question ? customValidationErrors.question : ''
//     );
//   }


  /* If no custom errors were found, form could still be invalid based on
     built-in validation. */
  const form = document.getElementById("policy-form");
  const builtInValidity = form.reportValidity();
  
  return customValidity && builtInValidity;
}

export default reportPolicyFormValidity;