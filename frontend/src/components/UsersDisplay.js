/* External Imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';
import { Search } from 'react-bootstrap-icons';
import { useState, useEffect, useContext, useRef } from 'react';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { filterUsers } from '../utils/userUtils';
import styles from './UsersDisplay.module.css';


////////////////////////
/// Helper Functions ///
////////////////////////

/* Takes in the setUsersDisplayArray function and sorts the input array before calling it */
const setSortedUsersDisplayArray = (usersArray, setUserDisplayArray) => {
  if (usersArray) {
    usersArray.sort(function (a, b) {
      if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) {
        return -1;
      }
      if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) {
        return 1;
      }
  
      if (a.first_name.toUpperCase() < b.first_name.toUpperCase()) {
        return -1;
      }
  
      if (a.first_name.toUpperCase() > b.first_name.toUpperCase()) {
        return 1;
      }
  
      return 0;
    });
  
    setUserDisplayArray(usersArray);
  }
}

const usersExist = (userData) => {
  if (userData?.users?.length > 0) {
    return true;
  }
  return false;
}

const usersArrayLoaded = (userDisplayArray) => {
  if (userDisplayArray && userDisplayArray.length > 0) {
    return true;
  }
  return false;
}


const UsersDisplay = (
  {
    addrData,
    allOwnersResidencesDict,
    allResidenceData,
    handleUserClicked,
    setFrontEndErrors,
    setBackEndErrors,
    setSuccessMessages,
    userData
  }) => 
{
  const emptyArray = [];
  const [ userDisplayArray, setUserDisplayArray ] = useState(emptyArray) // all users data in array form, sorted
  // const [ residenceData, setResidenceData ] = useState({residences: [],});
  //const [ addrData, setAddrData] = useState({addresses: {}});
  const { auth } = useContext(AuthContext);
  const searchRef = useRef(null);

  /* Set userDisplayArray whenever userData, addressData, or residence data is loaded.
     Also set the focus to the search bar.  If userData, addrData, or residenceData changes, we 
     don't want this user's UsersDisplay to just refresh and ignore search term filter constraints. */
  useEffect(() => {
    let search_term = '';

    /* If the search field has any value, update search_term before 
    sorting/filtering */
    if (searchRef?.current?.value) {
      search_term = searchRef.current.value.toUpperCase();
    }

    /* Create arguments for call to filterUsers */
    const users = userData?.users ? userData.users : null;
    const addresses = addrData?.addresses ? addrData.addresses : null;
    const residences = allResidenceData?.residences ? allResidenceData.residences : null;

    if (users) { // addresses and residences may be null
      setSortedUsersDisplayArray( 
        filterUsers(allOwnersResidencesDict, users, addresses, residences, search_term),
        setUserDisplayArray
      );
    }

    if (searchRef?.current) {
      searchRef.current.focus();
    }
  }, [auth, userData, addrData, allResidenceData]);


  const handleSearchInputChanged = (event) => {
    const search_term = event.target.value.toUpperCase();

    /* Create arguments for call to filterUsers */
    const users = userData?.users ? userData.users : null;
    const addresses = addrData?.addresses ? addrData.addresses : null;
    const residences = allResidenceData?.residences ? allResidenceData.residences : null;

    /* Filter all user entries based on whether the search text is found
       in either their user data or the user's address data */
    if (users) {
      setSortedUsersDisplayArray( 
        filterUsers(allOwnersResidencesDict, users, addresses, residences, search_term),
        setUserDisplayArray
      );
    }
  
    /* Clear the error and success states */
    setFrontEndErrors(null);
    setBackEndErrors(null);
    setSuccessMessages(null);
  }


  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <section id="usersdisplaycontainer" className="d-flex p-0 flex-column justify-content-center colorsettings_bodybackground heightsettings_usersdisplaycontainer">
        {
          usersExist(userData) ?
            <Form.Group>
              <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_usersearchfield colorsettings_bodybackground">
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
        <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Users List</u></h1>
        <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly usersdisplaytile colorsettings_bodybackground widthsettings_usersdisplaytile">
          <div>
            <ListGroup variant="flush" className="align-items-center justify-content-center">
              { 
                usersArrayLoaded(userDisplayArray) ?
                  userDisplayArray.map((obj, index) => (
                    <ListGroup.Item className="p-0" key={ index } action onClick={ () => handleUserClicked(obj) } variant="light">
                      <div key={ index } className="d-flex p-2 flex-wrap justify-content-between colorsettings_bodybackground colorsettings_bodybackgroundhover">
                        <div className={`${styles.container_image_size} d-flex align-items-center`}>
                          <img className={styles.image_size} src={ obj.image } alt="portrait"/>
                        </div>
                        <div className="d-flex flex-column justify-content-center ms-4">
                          <h5 className={`${styles.font_size_name} mt-2 mb-1 colorsettings_listtext`}><b>{ obj.last_name }, { obj.first_name }</b></h5>
                          <p className={`${styles.font_size_email} mt-1 mb-2 colorsettings_listtext`}>{ obj.email }</p>
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

export default UsersDisplay;
