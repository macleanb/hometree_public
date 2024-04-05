////////////////
///  Imports ///
////////////////

/* External Libraries */
import axios from 'axios';

/* Internal Libraries */
import { addAddress, deleteAddress, getAddressByID, getAddressValidationErrors, updateAddress } from './addressUtils';
import { getCSRFToken, getClient } from './apiUtils';
import { userIsAuthorized } from './authUtils';
import constants from '../constants';
import { getResponseError } from './errorUtils';
import { getUsersWithMailingAddress, userArrayHasUserID } from './userUtils';

/////////////////////////////////
/// Internal Helper Functions ///
/////////////////////////////////

/* Returns a url to fetch data for a specific residence */
const getResidenceURL = (residenceID) => {
  let result = null;
  if (residenceID) {
    result = constants.RESIDENCES_URL;
    result += residenceID + '/';
  }
  return result;
}

/* Creates a URL to fetch all users who own a specific residence */
const getUsersForResidenceURL = (residenceID) => {
  let result = null;
  if (residenceID) {
    result = constants.RESIDENCES_URL;
    result += residenceID + '/users/';
  }
  return result;
}

/* Creates a URL for a specific user_residence */
const getUserForResidenceURL = (residenceID, userID) => {
  let result = null;
  if (residenceID && userID) {
    result = constants.RESIDENCES_URL;
    result += residenceID + '/users/' + userID + '/';
  }
  return result;
}

///////////////////////////////
/// Export Helper Functions ///
///////////////////////////////

/* For a single residence object */
export const emptyResidenceData = () => { 
  return {
    fk_Address: null,
    join_date: '',
    owners: null,
    backendImageExists: false,
  }
}

/* Returns true if residenceData elements equal emptyResidenceData,
   otherwise false */
export const residenceDataIsEmpty = (residenceData) => {
  if (residenceData) {
    if (Object.keys(residenceData).length !== Object.keys(emptyResidenceData()).length) {
      return false;
    }

    if (!('fk_Address' in residenceData) || (residenceData.fk_Address !== null)) {
      return false;
    }

    if (!('join_date' in residenceData) || (residenceData.join_date !== '')) {
      return false;
    }

    if (!('owners' in residenceData) || (residenceData.owners !== null)) {
      return false;
    }

    if (!('backendImageExists' in residenceData) || (residenceData.backendImageExists !== false)) {
      return false;
    }

    return true;
  }
}

/* For holding many residence objects */
export const emptyResidencesForUserData = () => {
  return {
      user: null,
      residences: null
  };
}

/* Returns an array of filtered residences.
   Parameters:
    residenceArray: array of residence dicts
    possibleUsersDict: a dictionary of possible users (also dicts), keyed by user_id
    addressesDict: dict of address dicts
    search_term: string, MUST be upper case in order to work. */
export const filterResidences = (
  allResidenceOwnersDict,
  residenceArray,
  possibleUsersDict,
  addressesDict,
  search_term,
  ) =>
{
  /* Only filter if there are residences and a search term, otherwise
      just return the residences that were passed in */
  if (residenceArray && search_term) {
    try{
      const result = residenceArray.filter( (residence_obj) => {
        const re = new RegExp(search_term, "g");
        const address_obj = addressesDict[residence_obj.fk_Address];
  
        /* See if the search term matches any data in the residence's address */
        if (
          re.test(address_obj.street.toUpperCase()) || 
          (address_obj.street_2 && re.test(address_obj.street_2.toUpperCase())) || 
          re.test(address_obj.city.toUpperCase()) || 
          re.test(address_obj.addr_state.toUpperCase()) || 
          re.test(address_obj.zipcode.toString()))
        {
          return true;
        }
        
        /* See if the search term matches any user (owner) information:
            - See if any users have the address as a mailing address or
            - if any users who own the address (user residences) match the search term. */
        let usersToCheck = [];

        /* Populate usersToCheck with any users who own the residence_obj */
        if (allResidenceOwnersDict) {
          
          /* Build an array of all users to check for matches with the search term */
          let userIDsToCheck = allResidenceOwnersDict[residence_obj.id.toString()];

          /* Sometimes userIDsToCheck could be undefined if there aren't any residence-owner
            relationships for some residences */
          if (userIDsToCheck && userIDsToCheck.length > 0) {
            for (const userIDToCheck of userIDsToCheck) {
              usersToCheck.push(possibleUsersDict[userIDToCheck.toString()]);
            }
          }
        }

        /* Populate usersToCheck with any users with residence_obj as their mailing address */
        const usersWithMailingAddress = getUsersWithMailingAddress(address_obj.id, possibleUsersDict);

        if (usersWithMailingAddress && usersWithMailingAddress.length > 0) {
          usersToCheck = usersToCheck.concat(usersWithMailingAddress);
        }
  
        /* Now iterate through users to check as long as length > 0,
            looking for search term matches inside each user */
        if (usersToCheck.length > 0) {
          for (const user_dict of usersToCheck) {
            if (re.test(user_dict['first_name'].toUpperCase())) {              
              return true;
            } else if (re.test(user_dict['last_name'].toUpperCase())) {
              return true;
            } else if (re.test(user_dict['email'].toUpperCase())) {
              return true;
            }
          }
        }
        return false;
      });

      return result;
    } catch (e) {
      console.log(e);
      return residenceArray;
    }
  } else {
    return residenceArray;
  }
}

/* Returns a residenceID from an addressID, if one
   has the ID that was passed in. Otherwise returns null.
   Parameters:
     addrID: number 
     allResidenceData: array (with id field as number)
   Returns: residenceID (number) or null */
export const getResidenceIDFromAddrID = (addrID, allResidenceData) => {
  if (addrID && allResidenceData) {
    for (const i in allResidenceData) {
      
      /* See if the fk_Address of the current residence object matches the addrID that
          was passed in. */
      const residence_obj = allResidenceData[i];

      if (addrID === residence_obj.fk_Address) {
        return residence_obj.id;
      }
    }
  }

  return null;
}

/* Returns a residence index from the allResidenceData array, if one
   has the ID that was passed in. Otherwise returns null.
   Parameters:
     residenceID: number 
     allResidenceData: array (with id field as number)
   Returns: residence index (number) or null */
export const getResidenceIndexFromAllResidenceDataArray = (residenceID, allResidenceData) => {
  if (residenceID && allResidenceData) {
    for (const i in allResidenceData) {
      
      /* See if the ID of the current residence object matches the residenceID that
          was passed in. */
      const residence_obj = allResidenceData[i];

      if (residenceID === residence_obj.id) {
        return i;
      }
    }
  }

  return null;
}

/* Get any validation errors for residence object */
export const getResidenceValidationErrors = (residenceData) => {
  let result = null;

  if (!residenceData) {
    result = { general: `Error: residence data is invalid.` };
  } else if (residenceData.fk_Address === null) {
    result = { fk_address: `missing address` };
  }

  return result;
}

/* Returns true if addrData matches an existing residence,
   otherwise false */
export const residenceAlreadyExists = async (residenceData, auth, setBackEndErrors) => {
  if (residenceData) {
    /* Fetch all residences data as an array */
    const allResidencesArray = await getAllResidencesAsArray(auth, setBackEndErrors);

    if (allResidencesArray && allResidencesArray.length > 0) {
      for (const residence of allResidencesArray) {
        const addrID = residence.fk_Address;

        if (addrID) {
          /* Get the residence's address from the backEnd */
          const existingResidenceAddress = await getAddressByID(auth, addrID, setBackEndErrors);

          if (('street' in residenceData && residenceData.street) && ('street' in existingResidenceAddress && existingResidenceAddress.street)) {
            if (residenceData.street.toUpperCase() !== existingResidenceAddress.street.toUpperCase()) {
              continue; // addresses do not match
            }
          } else if (('street' in residenceData) || ('street' in existingResidenceAddress)) { // 'street' is only present in one
            continue; // addresses do not match
          }
      
          if (('street_2' in residenceData && residenceData.street_2) && ('street_2' in existingResidenceAddress && existingResidenceAddress.street_2)) {
            if (residenceData.street_2.toUpperCase() !== existingResidenceAddress.street_2.toUpperCase()) {
              continue; // addresses do not match
            }
          } else if (
                     (('street_2' in residenceData) && residenceData.street_2) || 
                     (('street_2' in existingResidenceAddress) && existingResidenceAddress.street_2)
                    ) { // 'street_2' is only present in one and not null, but not the other
            continue; // addresses do not match
          }
      
          if (('city' in residenceData && residenceData.city) && ('city' in existingResidenceAddress && existingResidenceAddress.city)) {
            if (residenceData.city.toUpperCase() !== existingResidenceAddress.city.toUpperCase()) {
              continue; // addresses do not match
            }
          } else if (('city' in residenceData) || ('city' in existingResidenceAddress)) { // 'city' is only present in one
            continue; // addresses do not match
          }
      
          if (('addr_state' in residenceData && residenceData.addr_state) && ('addr_state' in existingResidenceAddress && existingResidenceAddress.addr_state)) {
            if (residenceData.addr_state.toUpperCase() !== existingResidenceAddress.addr_state.toUpperCase()) {
              continue; // addresses do not match
            }
          } else if (('addr_state' in residenceData) || ('addr_state' in existingResidenceAddress)) { // 'addr_state' is only present in one
            continue; // addresses do not match
          }
      
          if (('zipcode' in residenceData) && ('zipcode' in existingResidenceAddress)) {
            if (residenceData.zipcode.toString() !== existingResidenceAddress.zipcode.toString()) {
              continue; // addresses do not match
            }
          } else if (('zipcode' in residenceData) || ('zipcode' in existingResidenceAddress)) { // 'zipcode' is only present in one
            continue; // addresses do not match
          }
  
          /* All fields are equal.  Return true.  */
          return true;
        }
      }
    }
  }

  return false;
}

//////////////////////////
///  API Calls - CRUD  ///
//////////////////////////

export const addResidence = async (
  auth,
  residenceData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_CREATE_ALL_RESIDENCES)) {
    try {
      /* Handle any blank fields on the 
      front end rather than sending blank credentials to the server */
      const addressValidationErrors = getAddressValidationErrors(residenceData);

      if (!addressValidationErrors) { // handleAddResidenceClicked reportValidity() should have reported
        /* Create the address and add to residenceData */
        
        const apiResponse = await addAddress(
          auth,
          residenceData,
          setFrontEndErrors,
          setBackEndErrors,
          setSuccessMessages
        );

        if (apiResponse && apiResponse.id) { // Address created successfully
          /* Append fk_Address to residenceData */
          const fk_Address = apiResponse.id;
          residenceData['fk_Address'] = fk_Address;

          /* Check for any validation errors before proceeding */
          const residenceValidationErrors = getResidenceValidationErrors(residenceData);

          if (!residenceValidationErrors) {
    
            const csrfToken = getCSRFToken();
            const client = getClient();
            const form_data = new FormData();
    
            if (residenceData) {
              form_data.append("fk_Address", residenceData.fk_Address);
    
              if (residenceData.join_date) {
                form_data.append("join_date", residenceData.join_date);
              }

              if (residenceData.lat && residenceData.lng) {
                form_data.append("lat", residenceData.lat);
                form_data.append("lng", residenceData.lng);
              }
            }
            
            if (csrfToken && client) {
              const response = await client.post(
                constants.RESIDENCES_URL,
                form_data,
                {
                  headers: { 'Content-Type': 'multipart/form-data',
                            "X-CSRFToken": csrfToken
                  },
                  withCredentials: true
                }
              );
              
              if (await response?.data) {
                /* Now add any owners */

                let ownersAdded = false;
                let backendErrorsExist = false;

                if (residenceData.owners) {
                  const residenceID = response.data.id;

                  for (const owner of residenceData.owners) {
                    const HOAUserResidenceFormData = new FormData();
                    HOAUserResidenceFormData.append('fk_HOAUser', owner.id);
                    HOAUserResidenceFormData.append('fk_Residence', residenceID);

                    try {
                      const addOwnerResponse = await client.post(
                        getUsersForResidenceURL(residenceID),
                        HOAUserResidenceFormData,
                        {
                          headers: { 'Content-Type': 'multipart/form-data',
                                    "X-CSRFToken": csrfToken
                          },
                          withCredentials: true
                        }
  
                      );

                      if (await addOwnerResponse?.data) {
                        ownersAdded = true;
                      }
                    } catch (e) {
                      backendErrorsExist = true;

                      // test
                      console.log(e);
                    }
                  }
                }
                if (!backendErrorsExist) {
                  setSuccessMessages({'Success': `Residence added successfully${ ownersAdded ? ' (along with owners)' : '' }.`});
                } else {
                  setBackEndErrors({Error: 'Residence created successfully, but at least one owner could not be added.'});
                }
              }
    
              return await response?.data;
            } else {
              throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
            }
          }  else {
            // Rely on built-in reportValidity() call in handleClick function
            // setFrontEndErrors(validationErrors);
          }
        }
      } else {
        // Rely on built-in reportValidity() call in handleClick function
        // setFrontEndErrors(validationErrors);
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to add that residence."});
    return null;
  }
}

export const deleteResidence = async (
  auth,
  residenceToDelete,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{
  /* Basic users shouldn't even have permission to delete their own residences */
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ALL_RESIDENCES)) {
    /* Instead of deleting the residence directly, just delete the address.
       The backend will automatically cascade and delete the Residence. */
    if (residenceToDelete.fk_Address) {
      const addrIDToDelete = residenceToDelete.fk_Address;

      const apiResponse = await deleteAddress(
        auth,
        addrIDToDelete,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages,
      );

      if (await apiResponse && apiResponse.status === 204) {
        setSuccessMessages({'Success': 'Residence deleted successfully.'});
      }

      return apiResponse;
    }


    // try {
    //   const csrfToken = getCSRFToken();
    //   const client = getClient();
      
    //   if (csrfToken && client) {
    //     const response = await client.delete(
    //       getResidenceURL(residenceIDToDelete),
    //       {
    //         headers: { 'Content-Type': 'multipart/form-data',
    //                    "X-CSRFToken": csrfToken
    //         },
    //         withCredentials: true
    //       }
    //     );
        
    //     if (await response && response.status === 204) {
    //       setSuccessMessages({'Success': 'Residence deleted successfully.'});
    //     }

    //     return await response;
    //   } else {
    //     throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
    //   }

    // } catch (error) {
    //   if (!error?.response) {
    //     setBackEndErrors({'Server Error': 'No Server Response'});
    //   } else {
    //     setBackEndErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
    //   }
    // }
  } else {
    setFrontEndErrors({Error: "You don't have permission to delete that residence."});
    return null;
  }
}

export const updateResidence = async (
  auth,
  residenceToUpdate,
  residenceData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) =>
{
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ALL_RESIDENCES)) {
    try {
      /* Handle any blank fields on the 
       front end rather than sending blank credentials to the server */
      const addressValidationErrors = getAddressValidationErrors(residenceData);

      if (!addressValidationErrors && residenceToUpdate?.fk_Address) { // handleUpdateResidenceClicked reportValidity() should have reported
        /* Get the addrIDToUpdate */
        const addrIDToUpdate = residenceToUpdate.fk_Address;

        /* Update the residence's address */
        const apiResponse = await updateAddress(
          auth,
          addrIDToUpdate,
          residenceData,
          setFrontEndErrors,
          setBackEndErrors,
          setSuccessMessages
        );

        if (apiResponse && apiResponse.id) { // Address updated successfully
          /* Append fk_Address to residenceData */
          const fk_Address = apiResponse.id; // Should be the same as before
          residenceData['fk_Address'] = fk_Address;

          /* Check for any validation errors before proceeding */
          const residenceValidationErrors = getResidenceValidationErrors(residenceData);

          if (!residenceValidationErrors) {
    
            const csrfToken = getCSRFToken();
            const client = getClient();
            const form_data = new FormData();
            
            if (csrfToken && client && residenceData) {
              form_data.append("fk_Address", residenceData.fk_Address);
              if (residenceData.join_date) {
                form_data.append("join_date", residenceData.join_date);
              }

              const response = await client.patch(
                getResidenceURL(residenceToUpdate.id),
                form_data,
                {
                  headers: { 'Content-Type': 'multipart/form-data',
                            "X-CSRFToken": csrfToken
                  },
                  withCredentials: true
                }
              );
              
              if (await response?.data?.id) {
                /* Now update any owners */
                const residenceID = response.data.id;
                let ownersUpdated = false;

                /* Don't add owners in residenceData that are already present in currentOwners on backend.
                   Also, if an owner is present on the backend, but not listed in residenceData.owners,
                   remove it from the backend. */
                const currentOwners = await getUsersForResidence(auth, residenceID, setBackEndErrors);

                const ownerIDsToNotAddToResidence = new Set();
                const ownersToRemoveFromResidence = [];
                if (await currentOwners) {
                  for (const owner of currentOwners) {
                    if (residenceData.owners && userArrayHasUserID(residenceData.owners, owner.id)) {
                      ownerIDsToNotAddToResidence.add(owner.id);
                    } else {
                      ownersToRemoveFromResidence.push(owner);
                    }
                  }
                }

                /* Now add all owners that don't already exist on backend */
                if (residenceData.owners) {
                  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_CREATE_ALL_USER_RESIDENCES)) {
                    for (const owner of residenceData.owners) {
                      if (!ownerIDsToNotAddToResidence.has(owner.id)) {
                        const HOAUserResidenceFormData = new FormData();
                        HOAUserResidenceFormData.append('fk_HOAUser', owner.id);
                        HOAUserResidenceFormData.append('fk_Residence', residenceID);
    
                        const addOwnerResponse = await client.post(
                          getUsersForResidenceURL(residenceID),
                          HOAUserResidenceFormData,
                          {
                            headers: { 'Content-Type': 'multipart/form-data',
                                      "X-CSRFToken": csrfToken
                            },
                            withCredentials: true
                          }
                        );
  
                        if (await addOwnerResponse?.data) {
                          ownersUpdated = true;
                        }
                      }
                    }
                  }
                }

                /* Now remove owners from backend that shouldn't own this residence anymore */
                if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ALL_USER_RESIDENCES)) {
                  for (const ownerToRemove of ownersToRemoveFromResidence) {
                    const deleteOwnerResponse = await client.delete(
                      getUserForResidenceURL(residenceID, ownerToRemove.id),
                      {
                        headers: { 'Content-Type': 'multipart/form-data',
                                  "X-CSRFToken": csrfToken
                        },
                        withCredentials: true
                      }
                    );

                    if (deleteOwnerResponse && deleteOwnerResponse.status === 204) {
                      ownersUpdated = true;
                    }
                  }  
                }

                setSuccessMessages({'Success': `Residence updated successfully${ ownersUpdated ? ' (along with owners)' : '' }.`});
              }
    
              return await response?.data;
            } else {
              throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
            }
          }  else {
            // Rely on built-in reportValidity() call in handleClick function
            // setFrontEndErrors(validationErrors);
          }
        }
      } else {
        // Rely on built-in reportValidity() call in handleClick function
        // setFrontEndErrors(validationErrors);
      }
    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to update that residence."});
    return null;
  }
}

export const getAllResidencesAsArray = async (auth, setBackEndErrors) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_RESIDENCES)) {
    
    try {
      //const response = await axios.get(constants.RESIDENCES_URL);
      const response = await getClient().get(constants.RESIDENCES_URL);
      
      return await response?.data;
    } catch (e) {
      console.log(e);
      setBackEndErrors(e);
    }
  }
}

export const getAllResidencesAsDict = async (auth, setBackEndErrors) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_RESIDENCES)) {
    try {
        // const response = await axios.get(constants.RESIDENCES_URL);
        const response = await getClient().get(constants.RESIDENCES_URL);
        const data = await response?.data;

        if (data) {
            const updated_residences = {}
            for (const residence of data) {
                if (residence) {
                  const residence_id = residence['id'];
                  updated_residences[residence_id] = residence;
                }
            }
            return updated_residences;
        }
    } catch (e) {
        console.log(e);
        setBackEndErrors(e);
    }
  }
}

/* Gets all residence ids (as keys) and arrays of owners (as values) */
export const getAllResidenceOwnersAsDict = async (auth, setBackEndErrors) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_USER_RESIDENCES)) {
    try {
      // const response = await axios.get(constants.ALL_USERS_FOR_ALL_RESIDENCES_URL);
      const response = await getClient().get(constants.ALL_USERS_FOR_ALL_RESIDENCES_URL);
      return await response?.data;
    } catch (e) {
        console.log(e);
        setBackEndErrors(e);
    }
  } else {
    return null;
  }
}

/* Gets all user ids (as keys) and arrays of residences (as values) */
export const getAllResidencesByOwnerAsDict = async (auth, setBackEndErrors) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_USER_RESIDENCES)) {
    try {
      // const response = await axios.get(constants.ALL_RESIDENCES_FOR_ALL_USERS_URL);
      const response = await getClient().get(constants.ALL_RESIDENCES_FOR_ALL_USERS_URL);
      return await response?.data;
    } catch (e) {
        console.log(e);
        setBackEndErrors(e);
    }
  } else {
    return null;
  }
}

/* Retrieves a single residence from the backend server */
export const getResidenceByID = async (auth, residenceID, setBackEndErrors) => {
    // TODO is there a way to check whether a user owns a residence from the frontend (the way
    // you do on the backend?)
    if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_RESIDENCES) ||
         userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_RESIDENCE)) {
      try {
          const residenceURL = getResidenceURL(residenceID);
          const response = await getClient().get(residenceURL);
          return await response?.data;
      } catch (e) {
          console.log(e);
          setBackEndErrors(e);
      }
    }
}

/* Queries the backend server for all users (owners) associated with 
   a given residence ID */
export const getUsersForResidence = async (auth, residenceID, setBackEndErrors) => {

  if (
      userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_RESIDENCES) &&
      userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_USERS)
    )
  {
    try {
      // const response = await axios.get(getUsersForResidenceURL(residenceID));
      const response = await getClient().get(getUsersForResidenceURL(residenceID));
      
      return await response?.data;
    } catch (e) {
      console.log(e);
      setBackEndErrors(e);
    }
  } else {
    setBackEndErrors({Error: "User does not have permissions to getUsersForResidence."});
  }

  return null;
}

/* Returns an array of owned residences for a given userID */
export const getResidencesForUser = async (auth, setBackEndErrors, userID) => {
  const allResidencesByOwner = await getAllResidencesByOwnerAsDict(auth, setBackEndErrors);

  if (await allResidencesByOwner) {
    return allResidencesByOwner[userID];
  }

  return [];
}

