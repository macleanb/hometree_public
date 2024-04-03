/* Internal Libraries */
import { getClient } from '../apiUtils';
import getURL_PolicyOptions from './getURL_PolicyOptions';
import { getResponseError } from '../errorUtils';

/* Gets all options for a given policyID from backend as array */
const getPolicyOptions = async (policyID, setBackEndErrors) => {
  // No need to enforce permissions for policy options
  try {
    const URL = getURL_PolicyOptions(policyID);
    const response = await getClient().get(URL);
    return await response?.data;
  } catch (e) {
      setBackEndErrors(getResponseError(e));
  }
};

export default getPolicyOptions;