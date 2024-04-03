/* Internal Libraries */
import getURL_ResidencePolicyChoices from './getURL_ResidencePolicyChoices';

const getURL_ResidencePolicyChoice = (policyID, residencePolicyChoiceID) => {
  let result = getURL_ResidencePolicyChoices(policyID);

  if (result) {
    result += residencePolicyChoiceID +  '/';
  }
  return result;
};

export default getURL_ResidencePolicyChoice;