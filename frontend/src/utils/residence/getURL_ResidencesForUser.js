/* Creates a URL to retrieve all residences owned by a user
   Inputs:
    - userID (int or string)
   Output:
    - URL (string)
*/
import constants from "../../constants";

const getURL_ResidencesForUser = (userID) => {
  let result = null;
  if (userID) {
    result = constants.USERS_URL;
    result += userID + '/residences/';
  }
  return result;
}

export default getURL_ResidencesForUser;