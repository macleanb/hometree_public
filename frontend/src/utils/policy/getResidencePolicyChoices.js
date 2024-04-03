/* Internal Libraries */
import { getClient } from '../apiUtils';
import getURL_ResidencePolicyChoices from './getURL_ResidencePolicyChoices';
import { getResponseError } from '../errorUtils';

/* Gets all residence policy choices for a given policyID from backend as array */
const getResidencePolicyChoices = async (policyID, setBackEndErrors) => {
  // No need to enforce permissions for residence policy choices
  try {
    const URL = getURL_ResidencePolicyChoices(policyID);
    const response = await getClient().get(URL);
    return await response?.data;
  } catch (e) {
      setBackEndErrors(getResponseError(e));
  }
};

export default getResidencePolicyChoices;