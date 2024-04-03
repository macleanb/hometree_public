/* Internal imports */
import constants from '../../constants';
import { getClient } from '../apiUtils';
import { getResponseError } from '../errorUtils';
import getURL_ResidencesForUser from './getURL_ResidencesForUser';
import { userIsAuthorized } from '../authUtils';

/* Returns an array of owned residences for a given userID */
const getResidencesForUser = async (auth, setBackEndErrors) => {
  const userID = auth.user?.id;

  if (userID && (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_RESIDENCE) || userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_USER_RESIDENCES))) {    
    try {
      const URL = getURL_ResidencesForUser(userID);
      const response = await getClient().get(URL);
      return await response?.data;
    } catch (e) {
      setBackEndErrors(getResponseError(e));
    }
  }
};

export default getResidencesForUser;