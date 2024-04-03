////////////////
///  Imports ///
////////////////

/* Internal Libraries */
import constants from '../../constants';
import getURL_Policy from './getURL_Policy';
import { getCSRFToken, getClient } from '../apiUtils';
import { getResponseError } from '../errorUtils';
import { userIsAuthorized } from '../authUtils';

/* Retrieves a single policy from the backend server */
const getPolicyByID = async (auth, policyID, setBackEndErrors) => {
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_POLICY)) {
    try {
        const policyURL = getURL_Policy(policyID);
        const client = getClient();
        const response = await client.get(policyURL);
        return await response?.data;

    } catch (e) {
        console.log(e);
        setBackEndErrors(getResponseError(e));
    }
  } else {
    setBackEndErrors({Error: "You don't have permission to retrieve that policy."});
  }
};

export default getPolicyByID;