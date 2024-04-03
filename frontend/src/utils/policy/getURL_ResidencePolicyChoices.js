/* Internal Libraries */
import getURL_Policy from './getURL_Policy';

const getURL_ResidencePolicyChoices = (policyID) => {
  let result = getURL_Policy(policyID);

  if (result) {
    result += 'residencepolicychoices/';
  }
  return result;
};

export default getURL_ResidencePolicyChoices;