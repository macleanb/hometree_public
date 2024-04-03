////////////////
///  Imports ///
////////////////

/* External Libraries */
import axios from 'axios';

/* Internal Libraries */
import { getCSRFToken, getClient } from './apiUtils';
import { userIsAuthorized } from './authUtils';
import constants from '../constants';
import { getResponseError } from './errorUtils';
import { getUsersWithMailingAddress } from './userUtils';

/////////////////////////////////
/// Internal Helper Functions ///
/////////////////////////////////

const getAddressURL = (addrID) => {
  let result = null;
  if (addrID) {
    result = constants.ADDRESSES_URL;
    result += addrID + '/';
  }
  return result;
}

///////////////////////////////
/// Export Helper Functions ///
///////////////////////////////

/* Returns true if addrData elements equal emptyAddrData,
   otherwise false */
export const addrDataIsEmpty = (addrData) => {
  if (addrData) {
    if (!('street' in addrData) || (addrData.street !== '')) {
      return false;
    }

    if (!('street_2' in addrData) || (addrData.street_2 !== '')) {
      return false;
    }

    if (!('city' in addrData) || (addrData.city !== '')) {
      return false;
    }

    if (!('addr_state' in addrData) || (addrData.addr_state !== '')) {
      return false;
    }

    if (!('zipcode' in addrData) || (addrData.zipcode !== '')) {
      return false;
    }

    if (!('image' in addrData) || (addrData.image !== null)) {
      return false;
    }

    if (!('imageFileName' in addrData) || (addrData.imageFileName !== '')) {
      return false;
    }

    if (!('deleteExistingImage' in addrData) || (addrData.deleteExistingImage !== false)) {
      return false;
    }

    if (!('backendImageExists' in addrData) || (addrData.backendImageExists !== false)) {
      return false;
    }
    return true;
  }
}

/* Returns true if addrData matches an existing address,
   otherwise false */
export const addrAlreadyExists = async (addrData, auth) => {
  if (addrData) {
    /* Fetch all address data as an array */
    const allAddressesArray = await getAllAddressesAsArray(auth);

    if (allAddressesArray && allAddressesArray.length > 0) {

      for (const address of allAddressesArray) {
        if (('street' in addrData) && ('street' in address)) {
          if (addrData.street !== address.street) {
            continue; // addresses do not match
          }
        } else if (('street' in addrData) || ('street' in address)) { // 'street' is only present in one
          continue; // addresses do not match
        }
    
        if (('street_2' in addrData) && ('street_2' in address)) {
          if (addrData.street_2 !== address.street_2) {
            continue; // addresses do not match
          }
        } else if (('street_2' in addrData) || ('street_2' in address)) { // 'street_2' is only present in one
          continue; // addresses do not match
        }
    
        if (('city' in addrData) && ('city' in address)) {
          if (addrData.city !== address.city) {
            continue; // addresses do not match
          }
        } else if (('city' in addrData) || ('city' in address)) { // 'city' is only present in one
          continue; // addresses do not match
        }
    
        if (('addr_state' in addrData) && ('addr_state' in address)) {
          if (addrData.addr_state !== address.addr_state) {
            continue; // addresses do not match
          }
        } else if (('addr_state' in addrData) || ('addr_state' in address)) { // 'addr_state' is only present in one
          continue; // addresses do not match
        }
    
        if (('zipcode' in addrData) && ('zipcode' in address)) {
          if (addrData.zipcode !== address.zipcode) {
            continue; // addresses do not match
          }
        } else if (('zipcode' in addrData) || ('zipcode' in address)) { // 'zipcode' is only present in one
          continue; // addresses do not match
        }

        /* All fields are equal.  Return true.  */
        return true;
      }
    }
  }

  return false;
}

export const emptyAddrData = () => {
  return {
    street: '',
    street_2: '',
    city: '',
    addr_state: '',
    zipcode: '',
    image: null,
    imageFileName: '',
    deleteExistingImage: false,
    backendImageExists: false,
  }
}

/* Returns an array of filtered addresses.
   Parameters:
    addressArray: array of address dicts
    possibleUsersDict: a dictionary of possible users (also dicts), keyed by user_id
    residencesArray: array of residence dicts
    search_term: string, MUST be upper case in order to work. */
export const filterAddresses = (
  addressArray,
  allResidenceOwnersDict,
  possibleUsersDict,
  residencesArray,
  search_term
  ) => 
{
  let result = addressArray;

  /* Only filter if there are addresses and a search term, otherwise
      just return the addresses that were passed in */
  if (addressArray && search_term) {
    result = addressArray.filter( (address_obj) => {
      const re = new RegExp(search_term, "g");

      /* First see if the search term matches any address data; street_2 may be null */
      if (re.test(address_obj.street.toUpperCase()) || (address_obj.street_2 && re.test(address_obj.street_2.toUpperCase())) || re.test(address_obj.city.toUpperCase()) || re.test(address_obj.addr_state.toUpperCase()) || re.test(address_obj.zipcode.toString())) {
        return true;
      /* If no address data was matched, see if any users have the address as a mailing address or
          any users who own the address (user residences) match the search term. */
      } else {
        /* Build an array of all users to check for matches with the search term */
        const usersToCheck = getUsersWithMailingAddress(address_obj.id, possibleUsersDict);

        /* Next filter all the residences that include address_obj and add
            those users to the search array as well */
        if (residencesArray && possibleUsersDict && allResidenceOwnersDict){
          const filteredResidences = residencesArray.filter( ( residence ) => {
            if (residence['fk_Address'] === address_obj.id){
              return true;
            }
            return false;
          });

          if (filteredResidences) {
            for (const residence of filteredResidences) { // Should only be one
              /* residence.fk_HOAUser may be null */
              const residenceID = residence.id;
              const ownersIDsArray = allResidenceOwnersDict[residenceID];

              if (ownersIDsArray && ownersIDsArray.length > 0) {
                for (const ownerID of ownersIDsArray) {
                  usersToCheck.push(possibleUsersDict[ownerID.toString()]);
                }
              }
            }
          }
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
      }
      return false;
    });
  }

  return result;
}

/* Returns an address index from the allAddrData array, if one
   has the ID that was passed in. Otherwise returns null.
   Parameters:
     addrID: number 
     allAddrData: array (with id field as number)
   Returns: address index (number) or null */
export const getAddrIndexFromAllAddrDataArray = (addrID, allAddrData) => {
  if (addrID && allAddrData) {
    for (const i in allAddrData) {
      
      /* See if the ID of the current address object matches the addrID that
          was passed in. */
      const address_obj = allAddrData[i];

      if (addrID === address_obj.id) {
        return i;
      }
    }
  }

  return null;
}


export const getAddressValidationErrors = (addrData) => {
  let result = null;

  if (!addrData) {
    result = { general: `Error: address data is invalid.` };
  } else if (addrData.street === '') {
    result = { street: `missing street` };
  } else if (addrData.city === '') {
    result = { city: `missing city` };
  } else if (addrData.addr_state === '' ) {
    result = { addr_state: `missing state` };
  } else if (addrData.zipcode === '' || addrData.zipcode === null || addrData.zipcode === undefined) {
    result = { zipcode: `missing zipcode` };
  }

  return result;
}

/* Returns the mailing address dict as a single element in an array
   for a given user, if one exists.  If no match is found, returns
   an empty array. */
export const getMailingAddressForUser = (user_obj, possibleAddressesDict) => {
  try {
    if (user_obj && user_obj.fk_mailing_address && possibleAddressesDict && Object.keys(possibleAddressesDict).length > 0) {
      const userMailingAddressID = user_obj.fk_mailing_address;
  
      if (userMailingAddressID) {
        const parsedUserMailingAddressID = userMailingAddressID.toString();
        const user_mailing_address_dict = possibleAddressesDict[parsedUserMailingAddressID];
  
        if (user_mailing_address_dict) {
          return [user_mailing_address_dict];
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return [];
}


//////////////////////////
///  API Calls - CRUD  ///
//////////////////////////

export const addAddress = async (auth, addressData, setFrontEndErrors, setBackEndErrors, setSuccessMessages) => {
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_CREATE_ALL_ADDRESSES) || 
  ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_ADD_ADDRESS) && !auth.user.fk_mailing_address)) {
    /* Make sure the manager calling this API assigns the new address to a user's fk_mailing_address
       upon creation, otherwise basic users will be able to create multiple addresses.  And make sure
       basic users (without the create ALL addresses permission) don't have access to any address
       managers that DON'T immediately assign a mailing address to a basic user. */
    try {
      /* Handle any blank fields on the 
      front end rather than sending blank credentials to the server */
      const validationErrors = getAddressValidationErrors(addressData);

      if (!validationErrors) { // handleAddAddressClicked reportValidity() should have reported

        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();

        if (addressData) {
          form_data.append("street", addressData.street);

          if (addressData.street_2) {
            form_data.append("street_2", addressData.street_2);
          }

          form_data.append("city", addressData.city);
          form_data.append("addr_state", addressData.addr_state);
          form_data.append("zipcode", addressData.zipcode);

          if (addressData.image && addressData.imageFileName) {
            form_data.append("image", addressData.image, addressData.imageFileName);
          }
        }
        
        if (csrfToken && client) {
          const response = await client.post(
            constants.ADDRESSES_URL,
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': 'Address added successfully.'});
          }

          return await response?.data;
        } else {
          throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
        }
      }  else {
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
    setFrontEndErrors({Error: "You don't have permission to add that address."});
    return null;
  }
}

export const deleteAddress = async (auth, addrIDToDelete, setFrontEndErrors, setBackEndErrors, setSuccessMessages) => {

  /* Basic users shouldn't even have permission to delete their own addresses */
  if(userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ALL_ADDRESSES) || 
   ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ADDRESS) && auth.user.fk_mailing_address === addrIDToDelete)) {
    try {
      const csrfToken = getCSRFToken();
      const client = getClient();
      
      if (csrfToken && client) {
        const response = await client.delete(
          getAddressURL(addrIDToDelete),
          {
            headers: { 'Content-Type': 'multipart/form-data',
                       "X-CSRFToken": csrfToken
            },
            withCredentials: true
          }
        );
        
        if (await response && response.status === 204) {
          setSuccessMessages({'Success': `Address deleted successfully.`});
        }

        return await response;
      } else {
        throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
      }

    } catch (error) {
      if (!error?.response) {
        setBackEndErrors({'Server Error': 'No Server Response'});
      } else {
        setBackEndErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
      }
    }
  } else {
    setFrontEndErrors({Error: "You don't have permission to delete that address."});
    return null;
  }
}

/* Retrieves a single address from the backend server */
export const getAddressByID = async (auth, addrID, setBackEndErrors) => {
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_ADDRESSES) || 
       userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ADDRESS)) {
     // If you want to verify auth.user.fk_mailing_address you'll have to update auth every time
     // a user updates their mailing address, which will refresh the entire app.
     // ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ADDRESS) && auth.user.fk_mailing_address === addrID)) {
    try {
        const addrURL = getAddressURL(addrID);
        const response = await axios.get(addrURL);
        return await response?.data;

    } catch (e) {
        console.log(e);
        setBackEndErrors(e);
    }
  } else {
    setBackEndErrors({Error: "You don't have permission to retrieve that address."});
  }
}

// TODO update by passing in setBackEndErrors and add to catch
export const getAllAddressesAsArray = async (auth) => {
  if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_ADDRESSES)) {
      try {
          const response = await axios.get(constants.ADDRESSES_URL);
          return await response?.data;
      } catch (e) {
          console.log(e);
      }
  }
}

// TODO update by passing in setBackEndErrors and add to catch
export const getAllAddressesAsDict = async (auth) => {
    if (userIsAuthorized(auth, constants.PERMISSIONS_CAN_VIEW_ALL_ADDRESSES)) {
        try {
            const response = await axios.get(constants.ADDRESSES_URL);
            const data = await response?.data;
    
            if (data) {
                const updated_addresses = {}
                for (const address of data) {
                    if (address) {
                      const address_id = address['id'];
                      updated_addresses[address_id] = address;
                    }
                }
                return updated_addresses;
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export const updateAddress = async (
  auth,
  addrIDToUpdate,
  addressData,
  setFrontEndErrors,
  setBackEndErrors,
  setSuccessMessages
  ) => 
{  
  if ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ALL_ADDRESSES) ||
       userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ADDRESS)) {
    // If you want to verify auth.user.fk_mailing_address you'll have to update auth every time
    // a user updates their mailing address, which will refresh the entire app.
    // ( userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ADDRESS) && auth.user.fk_mailing_address === addrIDToUpdate)) {
    try {
      /* Handle any blank fields on the 
       front end rather than sending blank credentials to the server */
      const validationErrors = getAddressValidationErrors(addressData);

      if (!validationErrors) {
        const csrfToken = getCSRFToken();
        const client = getClient();
        const form_data = new FormData();

        if (addressData) {
          form_data.append("street", addressData.street);

          if ('street_2' in addressData && addressData['street_2'] !== null) { // may be blank
            form_data.append("street_2", addressData.street_2);
          }

          form_data.append("city", addressData.city);
          form_data.append("addr_state", addressData.addr_state);
          form_data.append("zipcode", addressData.zipcode);

          if (addressData.image && addressData.imageFileName.length > 0) {
            form_data.append("image", addressData.image, addressData.imageFileName);
          } else if (addressData.deleteExistingImage) {
            form_data.append("image", '');
          }
        }
        
        if (csrfToken && client) {
          const response = await client.patch(
            getAddressURL(addrIDToUpdate),
            form_data,
            {
              headers: { 'Content-Type': 'multipart/form-data',
                        "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );
          
          if (await response?.data) {
            setSuccessMessages({'Success': `Address updated successfully.`});
          }

          return await response?.data;
        } else {
          throw new Error('Error in apiUtils: CSRF Token null or bad Axios client.');
        }
      }  else {
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
    setFrontEndErrors({Error: "You don't have permission to update that address."});
    return null;
  }
}
