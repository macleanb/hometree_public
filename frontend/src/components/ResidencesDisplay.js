/* External Inputs */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useContext, useRef } from 'react';
import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Search } from 'react-bootstrap-icons';
import ListGroup from 'react-bootstrap/ListGroup';

/* Internal Inputs */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { filterResidences, getAllResidencesAsDict } from '../utils/residenceUtils';
import { getAllAddressesAsArray, getAllAddressesAsDict } from '../utils/addressUtils';
import { getAllUsersAsDict } from '../utils/userUtils';
import styles from './ResidencesDisplay.module.css';


////////////////////////
/// Helper Functions ///
////////////////////////


// const setUserDataAsDict = async (auth, setUserData) => {
//   const data = await getAllUsersAsDict(auth);
//   if (data) {
//     setUserData({users: data});
//   } else {
//     setUserData({users: {}});
//   }
// }

// const setAddrDataAsDict = async (auth, setAddrData) => {
//   const data = await getAllAddressesAsDict(auth);
//   if (data) {
//     setAddrData({addresses: data});
//   } else {
//     setAddrData({addresses: {}});
//   }
  
// }

/* Takes in the setResidenceDisplayArray function and sorts the input array before calling it */
const setSortedResidenceDisplayArray = (auth, residenceArray, setResidenceDisplayArray) => {
  // TODO make this call await?
  const addrDict = getAllAddressesAsDict(auth);

  if (residenceArray && addrDict) {
    residenceArray.sort(function (a, b) {
      if (a && b) {
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
      }
  
      return 0;
    });
  
    setResidenceDisplayArray(residenceArray);
  }
}

const residenceDataLoaded = (residenceData) => {
  if (residenceData && residenceData.residences && residenceData.residences.length > 0) {
    return true;
  }
  return false;
}

const residenceArrayLoaded = (residenceDisplayArray) => {
  if (residenceDisplayArray && residenceDisplayArray.length > 0) {
    return true;
  }
  return false;
}

/* This component takes in residence data and displays it in 
   sorted order.  It provides a search bar to filter the data
   displayed and sends click events back to the parent component
   to be handled there. */
const ResidencesDisplay = (
  {
    addrData,
    allResidenceOwnersDict,
    handleResidenceClicked,
    setFrontEndErrors,
    setBackEndErrors,
    setSuccessMessages,
    residenceData,
    userData,
  }) =>
{
  
  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  const emptyArray = []
  const [ residenceDisplayArray, setResidenceDisplayArray] = useState(emptyArray) // all residence data in array form, sorted
  //const [ addrData, setAddrData ] = useState({addresses: {}});
  //const [ userData, setUserData ] = useState({users: {}});
  const { auth } = useContext(AuthContext);
  const searchRef = useRef(null);

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  const handleSearchInputChanged = async (event) => {
    const search_term = event.target.value.toUpperCase();

    /* Create arguments for call to filterResidences */
    const residences = residenceData?.residences ? residenceData.residences : null;
    const users = userData?.users ? userData.users : null;
    const addresses = addrData?.addresses ? addrData.addresses : null;

    /* Filter all residence entries based on whether the search text is found
        in either their residence data, user data, or the user's mailing address */
    if (residences) { // users and addresses may be null
      setSortedResidenceDisplayArray(
        auth,
        filterResidences(
          allResidenceOwnersDict,
          residences,
          users,
          addresses,
          search_term
        ),
        setResidenceDisplayArray
      );
    }

    /* Clear the error and success states */
    clearErrorStates();
  }

  ///////////////////
  /// Use Effects ///
  ///////////////////

  /* Once the page mounts and auth is loaded, call local async functions to get/set
  all backend data (other than residences), passing state setters as args */
  // useEffect(() => {
  //   if (auth) {
  //     //setUserDataAsDict(auth, setUserData);
  //     //setAddrDataAsDict(auth, setAddrData);
  //   }
  // }, [auth]);

  /* Set residenceDisplayArray once residenceData, userData, and addrData is loaded, and 
     any time those states are updated.  Also set the focus to the search bar.  If residenceData,
     userData, addrData changes, we don't want this user's ResidencesDisplay to just refresh
     and ignore search term filter constraints.  */
  useEffect(() => {
    let search_term = '';

    /* If the search field has any value, update search_term before sorting/filtering */
    if (searchRef?.current?.value) {
      search_term = searchRef.current.value.toUpperCase();
    }

    /* Create arguments for call to filterResidences */
    const residences = residenceData?.residences ? residenceData.residences : null;
    const users = userData?.users ? userData.users : null;
    const addresses = addrData?.addresses ? addrData.addresses : null;

    /* Filter all residence entries based on whether the search text is found
       in either their residence data, user data, or the user's mailing address */
      if (residences) { // users and addresses may be null
        setSortedResidenceDisplayArray(
          auth,
          filterResidences(
            allResidenceOwnersDict,
            residences,
            users,
            addresses,
            search_term
          ),
          setResidenceDisplayArray
        );
      }

    if (searchRef?.current) {
      searchRef.current.focus();
    }
  }, [auth, residenceData, userData, addrData]);


  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <section id="residencesdisplaycontainer" className="d-flex flex-column justify-content-center p-0 colorsettings_bodybackground heightsettings_residencesdisplaycontainer">
        {
          residenceDataLoaded(residenceData)
          ?
            <Form.Group>
              <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_residencesearchfield colorsettings_bodybackground">
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
            </Form.Group>
          : ''
        }
        <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Residences</u></h1>
        <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly residencesdisplaytile colorsettings_bodybackground widthsettings_residencesdisplaytile">
          <div>
            <ListGroup variant="flush" className="align-items-center justify-content-center">
              {
                residenceArrayLoaded(residenceDisplayArray) ?
                  residenceDisplayArray.map((obj, index) => (
                      <ListGroup.Item className="p-0" key={ index } action onClick={ () => handleResidenceClicked(obj) } variant="light">
                        <div key={ index } className="d-flex p-2 justify-content-between colorsettings_bodybackground colorsettings_bodybackgroundhover">
                          <div className={`${styles.container_image_size} d-flex align-items-center`}>
                            <img className={styles.image_size} src={ obj.image } alt="address"/>
                          </div>
                          
                          <div className="d-flex flex-column justify-content-center ms-4">
                            <h5 className={`${styles.font_size_street} mt-2 mb-1 colorsettings_listtext`}><b>{ obj.street }</b></h5>
                            {
                              obj.street_2 ? <p className={`${styles.font_size_street_2} mt-1 mb-1 colorsettings_listtext`}>{ obj.street_2 }</p> : ''
                            }
                            <p className={`${styles.font_size_city_state_zip} mt-1 mb-2 colorsettings_listtext`}>{obj.city},{' '}{obj.addr_state}{' '}{obj.zipcode}</p>
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

export default ResidencesDisplay;

