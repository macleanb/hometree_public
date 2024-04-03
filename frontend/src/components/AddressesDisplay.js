/* This component takes in address data and displays it in 
   sorted order.  It provides a search bar to filter the data
   displayed and sends click events back to the parent component
   to be handled there. */

import { useState, useEffect, useContext, useRef } from 'react';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { getAllUsersAsDict } from '../utils/userUtils';
import { getAllResidencesAsArray } from '../utils/residenceUtils';
import { filterAddresses } from '../utils/addressUtils';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Search } from 'react-bootstrap-icons';


////////////////////////
/// Helper Functions ///
////////////////////////


const setUserDataAsDict = async (auth, setUserData) => {
  const data = await getAllUsersAsDict(auth);
  if (data) {
    setUserData({users: data});
  } else {
    setUserData({users: {}});
  }
}

const setResidenceDataAsArray = async (auth, setResidenceData) => {
  const data = await getAllResidencesAsArray(auth);
  setResidenceData({residences: data});
}

/* Takes in the setAddressDisplayArray function and sorts the input array before calling it */
const setSortedAddressesDisplayArray = (addressArray, setAddressDisplayArray) => {
  
  if (addressArray) {
    addressArray.sort(function (a, b) {

      /* Compare just the street numbers */
      const reLeadingNumbersA = /^[0-9]+/;
      const reLeadingNumbersB = /^[0-9]+/;

      let matchA = null;
      let matchB = null;
      if (a.street && b.street) {
        matchA = a.street.match(reLeadingNumbersA);
        matchB = b.street.match(reLeadingNumbersB);
      }

      if (matchA && matchB) {
        const intA = parseInt(matchA);
        const intB = parseInt(matchB);

        if (intA < intB) {
          return -1;
        }

        if (intB < intA) {
          return 1;
        }
      } else if (matchA) {
        return -1;
      } else if (matchB) {
        return 1;
      }

      /* Compare the whole Street */
      if (a.street.toUpperCase() < b.street.toUpperCase()) {
        return -1;
      }
      if (a.street.toUpperCase() > b.street.toUpperCase()) {
        return 1;
      }
      
      /* Street_2: may be null */
      if (a.street_2 && b.street_2) {
        if (a.street_2.toUpperCase() < b.street_2.toUpperCase()) {
          return -1;
        }
    
        if (a.street_2.toUpperCase() > b.street_2.toUpperCase()) {
          return 1;
        }
      } else if (a.street_2) {
        return 1;
      } else if (b.street_2) {
        return -1;
      }

      /* City */
      if (a.city.toUpperCase() < b.city.toUpperCase()) {
        return -1;
      }
  
      if (a.city.toUpperCase() > b.city.toUpperCase()) {
        return 1;
      }


      /* State */
      if (a.addr_state.toUpperCase() < b.addr_state.toUpperCase()) {
        return -1;
      }
  
      if (a.addr_state.toUpperCase() > b.addr_state.toUpperCase()) {
        return 1;
      }

      /* Zipcode */
      if (a.zipcode < b.zipcode) {
        return -1;
      }
  
      if (a.zipcode > b.zipcode) {
        return 1;
      }
  
      return 0;
    });
  
    setAddressDisplayArray(addressArray);
  }
}

const addressDataLoaded = (addressData) => {
  if (addressData && addressData.addresses && addressData.addresses.length > 0) {
    return true;
  }
  return false;
}

const addressArrayLoaded = (addressDisplayArray) => {
  if (addressDisplayArray && addressDisplayArray.length > 0) {
    return true;
  }
  return false;
}

const AddressesDisplay = (
  {
    allResidenceOwnersDict,
    handleAddressClicked,
    setFrontEndErrors,
    setBackEndErrors,
    setSuccessMessages,
    addrData
  }) => 
{
  const emptyArray = []
  const [ addressDisplayArray, setAddressDisplayArray] = useState(emptyArray) // all addresses data in array form, sorted
  const [ userData, setUserData ] = useState({users: [],}); // raw user data dict (all users)
  const [ residenceData, setResidenceData ] = useState({residences: [],});
  const { auth } = useContext(AuthContext);
  const searchRef = useRef(null);

  /* Once the page mounts and auth is loaded, call the local async functions to query
    the backend to get all other data, passing the state setter functions
    as arguments */
  useEffect(() => {
    if (auth) {
      setUserDataAsDict(auth, setUserData);
      setResidenceDataAsArray(auth, setResidenceData);
    }
  }, [auth]);

  /* Set addressDisplayArray once addressData, userData, and residenceData is loaded,
     and any time those states are updated.  Also set the focus to the search bar.  If
     addrData, userData, residenceData changes, we don't want this user's AddressesDisplay to just refresh
     and ignore search term filter constraints.  */
  useEffect(() => {
    let search_term = '';

    /* If the search field has any value, update search_term before 
       sorting/filtering */
    if (searchRef?.current?.value) {
      search_term = searchRef.current.value.toUpperCase();
    }

    /* Create arguments for call to filterAddresses */
    const addresses = addrData?.addresses ? addrData.addresses : null;
    const users = userData?.users ? userData.users : null;
    const residences = residenceData?.residences ? residenceData.residences : null;

    if (addresses) { // users and residences may be null
      setSortedAddressesDisplayArray( 
        filterAddresses(addresses, allResidenceOwnersDict, users, residences, search_term),
        setAddressDisplayArray
      );
    }

    if (searchRef?.current) {
      searchRef.current.focus();
    }
  }, [auth, addrData, userData, residenceData]);


  const handleSearchInputChanged = (event) => {
    const search_term = event.target.value.toUpperCase();

    /* Create arguments for call to filterAddresses */
    const addresses = addrData?.addresses ? addrData.addresses : null;
    const users = userData?.users ? userData.users : null;
    const residences = residenceData?.residences ? residenceData.residences : null;

    /* Filter all address entries based on whether the search text is found
        in either their address data, user data or the user's residence data */
    if (addresses) {
      setSortedAddressesDisplayArray( // users and residences may be null
        filterAddresses(addresses, allResidenceOwnersDict, users, residences, search_term),
        setAddressDisplayArray
      );
    }

    /* Clear the error and success states */
      setFrontEndErrors(null);
      setBackEndErrors(null);
      setSuccessMessages(null);
  }


  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <section id="addressesdisplaycontainer" className="d-flex flex-column justify-content-center p-0 colorsettings_bodybackground heightsettings_addressesdisplaycontainer">
        {
          addressDataLoaded(addrData) ?
            <Form.Group>
              <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_addresssearchfield colorsettings_bodybackground">
                <Search color="royalblue" className="me-2" size={20} />
                <Form.Control
                  className="rounded-2"
                  placeholder="search name, address, email, etc."
                  aria-label="search terms"
                  aria-describedby="basic-addon2"
                  onChange={ handleSearchInputChanged }
                  ref={ searchRef }
                />
              </InputGroup> 
            </Form.Group> : ''
        }
        <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Address List</u></h1>
        <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly addressesdisplaytile colorsettings_bodybackground widthsettings_addressesdisplaytile">
          <div>
            <ListGroup variant="flush" className="align-items-center justify-content-center">
              {
                addressArrayLoaded(addressDisplayArray) ?
                  addressDisplayArray.map((obj, index) => (
                      <ListGroup.Item className="p-0" key={ index } action onClick={ () => handleAddressClicked(obj) } variant="light">
                        <div key={ index } className="d-flex p-2 flex-wrap justify-content-between colorsettings_bodybackground colorsettings_bodybackgroundhover">
                          <div className="d-flex align-items-center">
                            <img src={ obj.image } width="100" height="100" alt="address"/>
                          </div>
                          
                          <div className="d-flex flex-column justify-content-center ms-4">
                            <h5 className="mt-2 mb-1 colorsettings_listtext"><b>{ obj.street }</b></h5>
                            {
                              obj.street_2 ? <p className="mt-1 mb-1 colorsettings_listtext">{ obj.street_2 }</p> : ''
                            }
                            <p className="mt-1 mb-2 colorsettings_listtext">{obj.city},{' '}{obj.addr_state}{' '}{obj.zipcode}</p>
                          </div>
                        </div>
                      </ListGroup.Item>
                  )) : ''
              }
            </ListGroup>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
}

export default AddressesDisplay;

