/* Internal Libraries */
import getURL_ResidencePolicyChoices from './getURL_ResidencePolicyChoices';
import { getCSRFToken, getClient } from '../apiUtils';
import { getResponseError } from '../errorUtils';


const addPolicyChoice = async (
  makePublic,
  optionID,
  policyID,
  residenceID,
  setFrontEndErrors,
  setBackEndErrors
) => {
  if (typeof makePublic === 'boolean') {
    try {
      const csrfToken = getCSRFToken();
      const client = getClient();
      const form_data = new FormData();
      const URL = getURL_ResidencePolicyChoices(policyID);

      const residenceIDInt = parseInt(residenceID);
      const policyIDInt = parseInt(policyID);
      const policyOptionIDInt = parseInt(optionID);

      form_data.append("fk_Residence", residenceIDInt);
      form_data.append("fk_Policy", policyIDInt);
      form_data.append("fk_PolicyOption", policyOptionIDInt);
      form_data.append("make_public", makePublic);
      
      if (csrfToken && client) {
        const response = await client.post(
          URL,
          form_data,
          {
            headers: { 'Content-Type': 'multipart/form-data',
                      "X-CSRFToken": csrfToken
            },
            withCredentials: true
          }
        );

        return response?.data;
      } else {
        throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error));
      }
    }
  } else {
    setFrontEndErrors({Error: "Invalid data provided for new policy choice."});
    return null;
  }
};

export default addPolicyChoice;