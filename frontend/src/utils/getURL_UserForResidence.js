/* Creates a URL for a specific user_residence
   Inputs:
    - residenceID (int or string)
    - userID (int or string)
   Output:
    - URL (string)
*/
import constants from "../constants";

const getURL_UserForResidence = (residenceID, userID) => {
  let result = null;
  if (residenceID && userID) {
    result = constants.RESIDENCES_URL;
    result += residenceID.toString() + '/users/' + userID.toString() + '/';
  }
  return result;
}

export default getURL_UserForResidence;