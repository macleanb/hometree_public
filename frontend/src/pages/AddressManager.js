////////////////
///  Imports ///
////////////////

/* External Libraries */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AddressesDisplay from '../components/AddressesDisplay';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import {
  getAddressByID,
  getAllAddressesAsArray,
  getAddrIndexFromAllAddrDataArray,
  emptyAddrData
} from '../utils/addressUtils';
import ErrorDisplay from '../components/ErrorDisplay';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import NavContainer from '../components/NavContainer';
import { getAllResidenceOwnersAsDict } from '../utils/residenceUtils';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';

/* This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
   AddressesDisplay, and generic FormContainer that allows CRUD operations
   for Addresses.  */
const AddressManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ formData, setFormData ] = useState(emptyAddrData()); // must be elevated here because in some object managers (ResidenceManager) ownerInputMode state (Users/ResidencesDisplay state) can change while filling out a single form
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_ADDRESS);
  const [ formMode, setFormMode ] = useState(constants.MODE_ADDRESS_ADD);
  const [ selectedAddrData, setSelectedAddrData ] = useState(null);
  const [ allAddrData, setAllAddrData ] = useState({addresses: [],});
  const [ allResidenceOwnersDict, setAllResidenceOwnersDict ] = useState(null);

  /* Other Declarations */
  const navigate = useNavigate();


  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Gets address data asynchronously from API and sets the result to local state,
     using the state setter function as the only argument  */
  const setAddressDataAsArray = async (auth, setAllAddrData) => {
      const data = await getAllAddressesAsArray(auth);
      setAllAddrData({addresses: data});
  }

  /* Gets all owners for all residences data asynchronously from API and sets the result to local state,
  using the state setter function as the only argument  */
  const setAllResidenceOwnersAsDict = async (auth, setAllResidenceOwnersDict) => {
    const dict = await getAllResidenceOwnersAsDict(auth, setBackEndErrors);
    setAllResidenceOwnersDict(dict);
  }

  /* Updates a single address in the AllAddrData array with new information  */
  const updateSingleAddressInAddressDataArray = async (updatedAddr) => {
      if (updatedAddr.id && allAddrData.addresses) {

          /* Get the index of the existing address */
          const oldAddrIndex = getAddrIndexFromAllAddrDataArray(updatedAddr.id, allAddrData.addresses);

          if (oldAddrIndex) {

            /* Copy allAddrData to a temp variable before updating */
            const tempAllAddrData = {...allAddrData}

            /* Replace the old address with a copy of the new address */
            tempAllAddrData.addresses[oldAddrIndex] = {...updatedAddr};

            setAllAddrData(tempAllAddrData);
          }
      }
  }

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }

  //////////////////////
  /// Event Handlers ///
  //////////////////////

  const handleAddressCreated = (addrData) => {
    /* Refresh AddressesDisplay */
    setAddressDataAsArray(auth, setAllAddrData);

    /* Reset the form to ADD mode */
    setFormData(emptyAddrData());
    setFormMode(constants.MODE_ADDRESS_ADD);
    setSelectedAddrData(null);
  }

  const handleAddressUpdated = (newAddrData) => {
      /* Refresh AddressesDisplay */
      setAddressDataAsArray(auth, setAllAddrData);

      /* Update selectedAddrData state */
      setSelectedAddrData(newAddrData);
      
      /* Leave the formType as ADDRESS and the formMode as
      UPDATE in case the user wants to make more changes */
  }

  const handleAddressDeleted = () => {
      /* Refresh AddressesDisplay */
      setAddressDataAsArray(auth, setAllAddrData);
      
      /* Reset formType to ADDRESS and formMode to ADD */
      setFormData(emptyAddrData());
      setFormMode(constants.MODE_ADDRESS_ADD);
      setFormType(constants.FORM_TYPE_ADDRESS);
      setSelectedAddrData(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  // TODO update this to match UserManager handleUserClicked
  const handleAddressClicked = async (addr_dict) => {
    if (addr_dict) {
      /* Get the current address data from the backend */
      getAddressByID(auth, addr_dict.id, setBackEndErrors).then( (apiResponse) => {
        if (apiResponse && !backEndErrors && apiResponse.id) {
          const addrData = apiResponse;

          /* Update AddressesDisplay with current data */
          updateSingleAddressInAddressDataArray(addrData);

          /* Update selectedAddrData state */
          setSelectedAddrData(addrData);
        } else {
          setSelectedAddrData(emptyAddrData);
        }
      }).catch((error) => {
        setBackEndErrors(error);
        setSelectedAddrData(emptyAddrData);

        // test
        console.log(error);
      });

      //setFormData(emptyAddrData());
      setFormMode(constants.MODE_ADDRESS_UPDATE_DELETE);
      setFormType(constants.FORM_TYPE_ADDRESS);
    }
    clearErrorStates();
  }

  /* This switches the address form mode back to 'ADD' if the user clicks the
     "Add Address Instead" button while in the 'UPDATE OR DELETE' mode. */
  const handleSwitchAddressModeToAddClicked = (e) => {
    setFormData(emptyAddrData());
    setFormMode(constants.MODE_ADDRESS_ADD);
    setSelectedAddrData(null);
    clearErrorStates();
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* Ensure the user is authenticated.  If so, load all addresses for 
      display.  If not, redirect to login. */
  useEffect(() => {
  if (auth && auth.status && navigate) {
    if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
      navigate('/login');
    } else {
      getAllAddressesAsArray(auth).then((result) => {
        setAllAddrData({addresses: result});
      }).catch((error) => { setBackEndErrors({Error: 'Could not retrieve address data.'}) });

      setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
    }
  }
  }, [auth, navigate, setBackEndErrors]);


  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div className="colorsettings_bodybackground">
        <NavContainer />
        <ErrorDisplay className="colorsettings_bodybackground"/>
        <SuccessDisplay />
        <div className="d-flex flex-wrap justify-content-start addressmanagercontainer">
          <AddressesDisplay
            allResidenceOwnersDict={ allResidenceOwnersDict }
            handleAddressClicked={ handleAddressClicked }
            setFrontEndErrors={ setFrontEndErrors }
            setBackEndErrors={ setBackEndErrors }
            setSuccessMessages={ setSuccessMessages }
            addrData={ allAddrData }
          />
          <div className="d-flex me-5 flex-column flex-fill addressformcontainer">
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode }
              parentHandlers={
                {
                  handleAddressCreated: handleAddressCreated,
                  handleAddressUpdated: handleAddressUpdated,
                  handleAddressDeleted: handleAddressDeleted,
                  handleSwitchAddressModeToAddClicked: handleSwitchAddressModeToAddClicked,
                  updateSingleAddressInAddressDataArray: updateSingleAddressInAddressDataArray
                }
              }
              parentState={
                {
                  selectedAddrData: selectedAddrData
                }
              }
              setFormData={ setFormData }
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
}

export default AddressManager;