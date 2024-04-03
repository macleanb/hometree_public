/* Internal Libraries */
import constants from '../../constants';

const getURL_Policy = (policyID) => {
  let result = null;
  if (policyID) {
    result = constants.POLICIES_URL;
    result += policyID + '/';
  }
  return result;
};

export default getURL_Policy;