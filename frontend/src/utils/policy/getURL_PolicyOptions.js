/* Internal Libraries */
import getURL_Policy from './getURL_Policy';

const getURL_PolicyOptions = (policyID) => {
  let result = getURL_Policy(policyID);

  if (result) {
    result += 'options/';
  }
  return result;
};

export default getURL_PolicyOptions;