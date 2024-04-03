/* Internal Libraries */
import getURL_ResidencePolicyChoice from './getURL_ResidencePolicyChoice';
import { getCSRFToken, getClient } from '../apiUtils';
import { getResponseError } from '../errorUtils';


const updatePolicyChoice = async (
  residencePolicyChoiceID,
  makePublic,
  optionID,
  policyID,
  setFrontEndErrors,
  setBackEndErrors
) => {
  if (typeof makePublic === 'boolean') {
    try {
      const csrfToken = getCSRFToken();
      const client = getClient();
      const form_data = new FormData();
      const URL = getURL_ResidencePolicyChoice(policyID, residencePolicyChoiceID);

      const policyOptionIDInt = parseInt(optionID);
      form_data.append("fk_PolicyOption", policyOptionIDInt);
      form_data.append("make_public", makePublic);
      
      if (csrfToken && client) {
        const response = await client.patch(
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
    setFrontEndErrors({Error: "Invalid data provided to update policy choice."});
    return null;
  }
};

export default updatePolicyChoice;