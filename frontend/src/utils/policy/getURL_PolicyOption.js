/* Internal Libraries */
import getURL_PolicyOptions from './getURL_PolicyOptions';

const getURL_PolicyOption = (policyID, policyOptionID) => {
  let result = getURL_PolicyOptions(policyID);

  if (result) {
    result += policyOptionID + '/';
  }
  return result;
};

export default getURL_PolicyOption;