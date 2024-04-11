/* External Imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useEffect, useContext, useRef } from 'react';
import React from 'react';
import { Search } from 'react-bootstrap-icons';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import filterPolicies from '../utils/policy/filterPolicies';
import PolicyListCard from './PolicyListCard';
import styles from './PoliciesDisplay.module.css';

/* This component takes in announcement data and displays it in 
   sorted order.  It provides a search bar to filter the data
   displayed and sends click events back to the parent component
   to be handled there. */
const PoliciesDisplay = (
  {
    policiesDataArr,
    handlePolicyClicked,
    setFrontEndErrors,
    setBackEndErrors,
    setSuccessMessages
  }) => 
{
  const emptyArray = []
  const [ policiesDisplayArray, setPoliciesDisplayArray] = useState(emptyArray) // all policies data in array form, sorted
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

  /* Sorts the filtered policiesArray data for display, most recent on top */
  const setSortedPoliciesDisplayArray = (filteredPolicies) => {
    if (filteredPolicies) {
      filteredPolicies.sort(function (a, b) {
        if (a.statement && b.statement) {
          if (a.statement.toUpperCase() < b.statement.toUpperCase()) {
            return -1;
          } else if (a.statement.toUpperCase() > b.statement.toUpperCase()) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      });
    
      setPoliciesDisplayArray(filteredPolicies);
    }
  }

  /* Set policiesDisplayArray once policiesData is loaded,
     and any time those states are updated.  Also set the focus to the search bar.  If
     policiesData changes, we don't want this user's PoliciesDisplay to just refresh
     and ignore search term filter constraints.  */
  useEffect(() => {
    let search_term = '';

    /* If the search field has any value, update search_term before 
       sorting/filtering */
    if (searchRef?.current?.value) {
      search_term = searchRef.current.value.toUpperCase();
    }

    if (policiesDataArr?.length > 0) {
      setSortedPoliciesDisplayArray( 
        filterPolicies(policiesDataArr, search_term),
      );
    }

    if (searchRef?.current) {
      searchRef.current.focus();
    }
  }, [policiesDataArr]);


  const handleSearchInputChanged = (event) => {
    const search_term = event.target.value.toUpperCase();

    /* Filter all policy entries based on whether the search text is found
        in their policy data */
    if (policiesDataArr?.length > 0) {
      setSortedPoliciesDisplayArray(
        filterPolicies(policiesDataArr, search_term)
      );
    }

    /* Clear the error and success states */
    clearErrorStates();
  }

  //////////////
  /*  Render  */
  //////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <section id="policiesdisplaycontainer" className={`${styles.outer_container_size} ${styles.outer_container_border} d-flex flex-column justify-content-start p-0 colorsettings_bodybackground heightsettings_policiesdisplaycontainer`}>
        <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Policies</u></h1>
        <Form.Group>
          {/* <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_policiessearchfield colorsettings_bodybackground"> */}
          <InputGroup className={`${ styles.search_container_size } align-items-center colorsettings_bodybackground`}>
            <Search color="royalblue" className={`${ styles.search_icon_size } me-2"`} />
            <Form.Control
              className="rounded-2"
              placeholder="search policies..."
              aria-label="search terms"
              aria-describedby="basic-addon2"
              onChange={ handleSearchInputChanged }
              ref={ searchRef }
            />
          </InputGroup> 
        </Form.Group>
        {/* <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly policiesdisplaytile colorsettings_bodybackground widthsettings_policiesdisplaytile"> */}
        <div className={`${ styles.list_container_size } d-flex m-0 p-2 justify-content-evenly policiesdisplaytile colorsettings_bodybackground`}>
            <ListGroup variant="flush" className={`${styles.list_group_size} align-items-center justify-content-center`}>
              {
                policiesDisplayArray?.length > 0
                ?
                  policiesDisplayArray.map((obj, index) => (
                    <PolicyListCard
                      key={ index }
                      handleObjClicked={ handlePolicyClicked }
                      headlineFieldName={ 'statement' }
                      label='policy'
                      obj={ obj }
                    />
                  )) : ''
              }
            </ListGroup>
        </div>
      </section>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
}

export default PoliciesDisplay;
