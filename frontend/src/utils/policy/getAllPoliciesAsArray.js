////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import { getClient } from '../apiUtils';
import { userIsAuthorized } from '../authUtils';
import constants from '../../constants';

const getAllPoliciesAsArray = async (auth) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_POLICY)) {
    
    try {
      const client = getClient();

      const response = await client.get(constants.POLICIES_URL);
        return await response?.data;
    } catch (e) {
        console.log(e);
    }
  }
};

export default getAllPoliciesAsArray;