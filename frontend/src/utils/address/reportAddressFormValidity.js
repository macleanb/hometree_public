/* Internal Imports */
import suggestValidationAction from './suggestValidationAction';
import getGAPIAddressValidationData from './getGAPIAddressValidationData';
import convertGAPIAddressComponentToName from './convertGAPIAddressComponentToName';

/* Reports whether formData is valid, and returns
   a boolean indicating the validity.
   Inputs:
    - elementRefs: a ref object containing references to DOM elements
    - formData: a dict containing the submitted form data
   Output:
    - boolean: true if data is valid, false otherwise */
const reportAddressFormValidity = async (formData, elementRefs, setBackEndErrors) => {
  let externalValidity = false;

  /* Check built-in form validation first. */
  let form;
  form = document.getElementById("address-form");

  if (!form) {
    form = document.getElementById("residence-form");
  }

  const builtInValidity = form.reportValidity();
  
  /* If the address data appears valid from the front-end, send to 
     GAPI to perform extra validation there */
  if (builtInValidity) {
    const response = await getGAPIAddressValidationData(formData, null, setBackEndErrors);
    
    let suggestion
    if (response?.data && Object.keys(response?.data).length > 0) {
      suggestion = await suggestValidationAction(response.data, setBackEndErrors);
    } else {
      throw new Error('Response data in reportAddressFormValidity was empty');
    }

    const updatedBackEndErrors = {};
    const addressComponents = response.data.result.result.address.addressComponents;

    /* See if spelling was corrected and not reported explicitly */
    let spellingWasCorrectedButVerdictNotUpdated;
    const responseStreet = addressComponents[0].componentName.text + ' ' + addressComponents[1].componentName.text;
    if (responseStreet !== formData.street) {
      spellingWasCorrectedButVerdictNotUpdated = true;
      updatedBackEndErrors['Street'] = `check input (suggest ${responseStreet})`;
    } else if ( addressComponents[2].componentType === 'locality' && addressComponents[2].componentName.text !== formData.city) {
      spellingWasCorrectedButVerdictNotUpdated = true;
      updatedBackEndErrors['City'] = `check input (suggest ${addressComponents[2].componentName.text})`;
    } else if ( addressComponents[3].componentType === 'administrative_area_level_1' && addressComponents[3].componentName.text !== formData.addr_state) {
      spellingWasCorrectedButVerdictNotUpdated = true;
      updatedBackEndErrors['State'] = `check input (suggest ${addressComponents[3].componentName.text})`;
    } else if ( addressComponents[4].componentType === 'postal_code' && addressComponents[4].componentName.text !== formData.zipcode.toString()) {
      spellingWasCorrectedButVerdictNotUpdated = true;
      updatedBackEndErrors['Zip Code'] = `check input (suggest ${addressComponents[4].componentName.text})`;
    }

    if (spellingWasCorrectedButVerdictNotUpdated) {
      setBackEndErrors(updatedBackEndErrors);
    } else if (suggestion?.suggestedAction === 'FIX') {
      /* FIX - prompt the user to fix the address */
      if (response.data.result?.result?.verdict?.hasUnconfirmedComponents === true ) {
        /* Extract unconfirmed components and add to backend errors */
        const unconfirmedComponentTypes = response.data.result.result.address.unconfirmedComponentTypes;

        //updatedBackEndErrors['Error'] = "The address provided isn't recognized.  Please edit and resubmit.";
        for (const component of unconfirmedComponentTypes) {
          updatedBackEndErrors[convertGAPIAddressComponentToName(component)] = 'must fix';
        }

        setBackEndErrors(updatedBackEndErrors);
      } else {
        throw new Error('Validation Data did not contain required fields');
      }
    } else if (suggestion?.suggestedAction === 'CORRECT_SPELLING') {
      /* Extract unconfirmed components and add to backend errors */
      const addressComponents = response.data.result.result.address.addressComponents;

      for (const component of addressComponents) {
        let componentToFix = convertGAPIAddressComponentToName(component.componentType);

        if (component.spellCorrected === true) {
          updatedBackEndErrors[componentToFix] = `check spelling (suggest ${component.componentName.text})`;
        } else if (component.replaced === true) {
          updatedBackEndErrors[componentToFix] = `check input (suggest ${component.componentName.text})`;
        } else if (component.inferred === true) {
          /* Ignore zip code suffix since the backend database
             only allows integers */
          if (componentToFix !== 'Zipcode suffix ("-XXXX")') {
            updatedBackEndErrors[componentToFix] = `check input (suggest ${component.componentName.text})`;
          }
        }
      }

      /* Only set backend errors if any were added.
         (The first is the generic one). */
      if (Object.keys(updatedBackEndErrors).length > 0) {
        setBackEndErrors(updatedBackEndErrors);
      } else {
        externalValidity = true; // Just accept the address and update
        
        if (
          response?.data?.result?.geocode?.location?.latitude &&
          response?.data?.result?.geocode?.location?.longitude
        ) {
          formData['lat'] = response.data.result.geocode.location.latitude;
          formData['lng'] = response.data.result.geocode.location.longitude;
        }
      }
    } else if (suggestion?.suggestedAction === 'ACCEPT') {
      /* ACCEPT - continue with the address returned by the API. */
      externalValidity = true;
      
      if (
        response?.data?.result?.geocode?.location?.latitude &&
        response?.data?.result?.geocode?.location?.longitude
      ) {
        formData['lat'] = response.data.result.geocode.location.latitude;
        formData['lng'] = response.data.result.geocode.location.longitude;
      }
    }
  }

  return externalValidity;
}

export default reportAddressFormValidity;