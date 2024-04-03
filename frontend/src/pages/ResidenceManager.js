////////////////
///  Imports ///
////////////////

/* External Libraries */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import {
  getAddressByID,
  getAllAddressesAsDict,
} from '../utils/addressUtils';
import ErrorDisplay from '../components/ErrorDisplay';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import NavContainer from '../components/NavContainer';
import ResidencesDisplay from '../components/ResidencesDisplay';
import {
  emptyResidenceData,
  getAllResidencesAsArray,
  getAllResidenceOwnersAsDict,
  getAllResidencesByOwnerAsDict,
  getResidenceByID,
  getResidenceIndexFromAllResidenceDataArray
} from '../utils/residenceUtils';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';
import { getAllUsersAsArray, getAllUsersAsDict } from '../utils/userUtils';
import UsersDisplay from '../components/UsersDisplay';

/* This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
   AddressesDisplay, and generic FormContainer that allows CRUD operations
   for Addresses.  */
const ResidenceManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ allAddressesDataDict, setAllAddressesDataDict ] = useState(null);
  const [ allOwnersResidencesDict, setAllOwnersResidencesDict ] = useState(null);
  const [ allResidenceDataArray, setAllResidenceDataArray ] = useState({residences: [],});
  const [ allResidenceDataDict, setAllResidenceDataDict ] = useState(null);
  const [ allResidenceOwnersDict, setAllResidenceOwnersDict ] = useState(null); 
  const [ allUserDataArray, setAllUserDataArray ] = useState({users: [],});
  const [ allUserDataDict, setAllUserDataDict ] = useState({users: [],});
  const [ formData, setFormData ] = useState(emptyResidenceData()); // must be elevated here because ownerInputMode state (Users/ResidencesDisplay state) can change while filling out a single form
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_RESIDENCE);
  const [ formMode, setFormMode ] = useState(constants.MODE_RESIDENCE_ADD);
  const [ ownerInputMode, setOwnerInputMode ] = useState(null);
  const [ selectedOwnerInUsersDisplay, setSelectedOwnerInUsersDisplay ] = useState(null);
  const [ selectedOwnerIDInOwnerSelect, setSelectedOwnerIDInOwnerSelect ] = useState(null);
  const [ selectedResidenceData, setSelectedResidenceData ] = useState(null);


  /* Ref Declarations */
  //const ownerInputMode = useRef(null);

  /* Other Declarations */
  const navigate = useNavigate();


  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Updates ownerInputMode useRef */
  // const setOwnerInputMode = (mode) => {
  //   ownerInputMode.current = mode;
  // }

  /* Retrieve address data from backend */
  const setAllAddressDataAsDict = async () => {
    const data = await getAllAddressesAsDict(auth);
    setAllAddressesDataDict({addresses: data});
  }

  /* Gets all owners (as an array assigned to a dict value) for all residences 
     (as keys) data asynchronously from API and sets the result to local state,
    using the state setter function as the only argument  */
  const setAllResidenceOwnersAsDict = async (auth, setAllResidenceOwnersDict) => {
    const dict = await getAllResidenceOwnersAsDict(auth, setBackEndErrors);
    setAllResidenceOwnersDict(dict);
  }

  /* Gets all owners (as keys) and all residences arrays (as values)
  asynchronously from API and sets the result to local state,
  using the state setter function as the only argument  */
  const setAllResidencesByOwnersAsDict = async (auth, setAllOwnersResidencesDict) => {
    const dict = await getAllResidencesByOwnerAsDict(auth, setBackEndErrors);
    setAllOwnersResidencesDict(dict);
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
  using the state setter function as the only argument  */
  const setAllResidenceDataAsDict = async () => {
    const residencesArr = await getAllResidencesAsArray(auth);
    const addrDict = await getAllAddressesAsDict(auth);
    const residencesDict = {};

    /* For each residence in residencesArr, import the address fields
    directly into the residence element.  The fields will be referenced
    during render */
    for (const residence of residencesArr) {
      const addr_id = residence.fk_Address;

      residence['addrID'] = addr_id;
      residence['street'] = addrDict[addr_id].street;
      residence['street_2'] = addrDict[addr_id].street_2;
      residence['city'] = addrDict[addr_id].city;
      residence['addr_state'] = addrDict[addr_id].addr_state;
      residence['zipcode'] = addrDict[addr_id].zipcode;
      residence['image'] = addrDict[addr_id].image;

      residencesDict[residence.id] = residence;
    }
    
    setAllResidenceDataDict({residences: residencesDict});
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
     using the state setter function as the only argument  */
  const setResidenceDataAsArray = async (auth, setAllResidenceDataArray) => {
    const residencesArr = await getAllResidencesAsArray(auth);
    const addrDict = await getAllAddressesAsDict(auth);

    /* For each residence in residencesArr, import the address fields
    directly into the residence element.  The fields will be referenced
    during render */
    for (const residence of residencesArr) {
      const addr_id = residence.fk_Address;

      residence['street'] = addrDict[addr_id].street;
      residence['street_2'] = addrDict[addr_id].street_2;
      residence['city'] = addrDict[addr_id].city;
      residence['addr_state'] = addrDict[addr_id].addr_state;
      residence['zipcode'] = addrDict[addr_id].zipcode;
      residence['image'] = addrDict[addr_id].image;
    }
    
    setAllResidenceDataArray({residences: residencesArr});
  }

  /* Gets user data asynchronously from API and sets the result to local state,
    using the state setter function as the only argument  */
  const setUserDataAsArray = async (auth, setAllUserDataArray) => {
    const data = await getAllUsersAsArray(auth);
    setAllUserDataArray({users: data});
  }

  /* Gets user data asynchrnously from API and sets the result as a dict */
  const setAllUserDataAsDict = async () => {
    const data = await getAllUsersAsDict(auth);
    setAllUserDataDict({users: data});
  }

  /* Updates a single address (residence) in the AllResidenceDataArray with new information  */
  const updateSingleResidenceInResidenceDataArray = async (updatedResidence) => {
      if (updatedResidence.id && allResidenceDataArray.residences) {

          /* Get the index of the existing residence */
          const oldResidenceIndex = getResidenceIndexFromAllResidenceDataArray(
            updatedResidence.id,
            allResidenceDataArray.residences
          );

          if (oldResidenceIndex) {

            /* Copy allResidenceDataArray to a temp variable before updating */
            const tempAllResidenceDataArray = {...allResidenceDataArray}

            /* Replace the old residence with a copy of the new residence */
            tempAllResidenceDataArray.residences[oldResidenceIndex] = {...updatedResidence};

            setAllResidenceDataArray(tempAllResidenceDataArray);
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

  const handleResidenceCreated = (residenceData) => {
    if (residenceData && residenceData.id) {
      /* Refresh data ResidencesDisplay and UsersDisplay*/
      setResidenceDataAsArray(auth, setAllResidenceDataArray);
      setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
      setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
      setAllAddressDataAsDict();
      setAllResidenceDataAsDict();

      /* Reset the form to ADD mode */
      setFormData(emptyResidenceData());
      setFormMode(constants.MODE_RESIDENCE_ADD);
      setFormType(constants.FORM_TYPE_RESIDENCE);
      setSelectedResidenceData(null);
    }
  }

  const handleResidenceUpdated = (residenceData) => {
      /* Refresh data ResidencesDisplay and UsersDisplay*/
      setResidenceDataAsArray(auth, setAllResidenceDataArray);
      setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
      setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
      setAllAddressDataAsDict();
      setAllResidenceDataAsDict();

      /* Update selectedResidenceData.  First get the residence's address data from the backend */
      getAddressByID(auth, residenceData.fk_Address, setBackEndErrors).then((addrAPIResponse) => {
        if (addrAPIResponse && !backEndErrors && addrAPIResponse.id) {
          const addrData = addrAPIResponse;

          residenceData['street'] = addrData.street;
          residenceData['street_2'] = addrData.street_2;
          residenceData['city'] = addrData.city;
          residenceData['addr_state'] = addrData.addr_state;
          residenceData['zipcode'] = addrData.zipcode;
          residenceData['image'] = addrData.image;
        }

        /* Leave the formType as RESIDENCE and the formMode as
           UPDATE in case the user wants to make more changes */
        setSelectedResidenceData(residenceData);
      }).catch((error) => {
        setBackEndErrors(error);

        // test
        console.log(error);
      });

      setFormData(emptyResidenceData());
  }

  // TODO maybe remove async and await below if not needed
  const handleResidenceDeleted = async () => {
    /* Delete the residence associated with the deleted address.
       NO direct delete needed as long as backend auto-deletes residences when
      their fk_addresses are deleted */

    /* Refresh data ResidencesDisplay and UsersDisplay*/
    setResidenceDataAsArray(auth, setAllResidenceDataArray);
    setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
    setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
    setAllAddressDataAsDict();
    setAllResidenceDataAsDict();
            
    /* Reset formType to ADDRESS and formMode to ADD */
    setFormData(emptyResidenceData());
    setFormMode(constants.MODE_RESIDENCE_ADD);
    setFormType(constants.FORM_TYPE_RESIDENCE);
    setSelectedResidenceData(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  /* This function switches the residencesDisplay to a usersDisplay
     so the user can click on which users they want to add as owners. */
  const handleAssignOwnersClicked = () => {
    setOwnerInputMode(constants.MODE_ASSIGN_OWNERS);
  }

  /* This function switches the usersDisplay back to residencesDisplay
     once the user is done adding owners. */
  const handleDoneAssigningOwnersClicked = () => {
    setOwnerInputMode(null);
  }

  const handleResidenceClicked = async (residenceDict) => {
    if (residenceDict) {
      /* Get the current residence data from the backend */
      getResidenceByID(auth, residenceDict.id, setBackEndErrors).then( (apiResponse) => {
        if (apiResponse && !backEndErrors && apiResponse.id) {
          const residenceData = apiResponse;

          /* Now get the residence's address data from the backend */
          getAddressByID(auth, residenceData.fk_Address, setBackEndErrors).then((addrAPIResponse) => {
            if (addrAPIResponse && !backEndErrors && addrAPIResponse.id) {
              const addrData = addrAPIResponse;

              /* Modify residenceData to include all child address fields */
              residenceData['street'] = addrData.street;
              residenceData['street_2'] = addrData.street_2;
              residenceData['city'] = addrData.city;
              residenceData['addr_state'] = addrData.addr_state;
              residenceData['zipcode'] = addrData.zipcode;
              residenceData['image'] = addrData.image;

              /* Update ResidencesDisplay with current data */
              updateSingleResidenceInResidenceDataArray(residenceData);

              /* Update selectedResidenceData state */
              setSelectedResidenceData(residenceData);
            }
          }).catch((error) => {
            setBackEndErrors(error);
            setSelectedResidenceData(emptyResidenceData);
    
            // test
            console.log(error);
          });
        } else {
          setSelectedResidenceData(emptyResidenceData);
        }
      }).catch((error) => {
        setBackEndErrors(error);
        setSelectedResidenceData(emptyResidenceData);

        // test
        console.log(error);
      });

      setFormMode(constants.MODE_RESIDENCE_UPDATE_DELETE);
      setFormType(constants.FORM_TYPE_RESIDENCE);
    }
    clearErrorStates();
  }

  /* This switches the residence form mode back to 'ADD' if the user clicks the
     "Add Residence Instead" button while in the 'UPDATE OR DELETE' mode. */
  const handleSwitchResidenceModeToAddClicked = (e) => {
    setFormData(emptyResidenceData());
    setFormMode(constants.MODE_RESIDENCE_ADD);
    setSelectedResidenceData(null);
    clearErrorStates();
  }

  /* Handles a click on a user button in UsersDisplay */
  const handleUserClicked = (userDict) => {
    const tempSelectedOwner = { ...userDict };
    setSelectedOwnerInUsersDisplay(tempSelectedOwner);
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* Ensure the user is authenticated.  If so, load all residences for 
      display.  If not, redirect to login. */
  useEffect(() => {
  if (auth && auth.status && navigate) {
    if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
      navigate('/login');
    } else {
      /* Refresh data ResidencesDisplay and UsersDisplay*/
      setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
      setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
      setAllAddressDataAsDict();
      setAllUserDataAsDict();
      setAllResidenceDataAsDict();

      if (ownerInputMode === null) {
        setResidenceDataAsArray(auth, setAllResidenceDataArray);
        setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
      } else {
        setUserDataAsArray(auth, setAllUserDataArray);
      }
    }
  }
  }, [auth, navigate, ownerInputMode, setBackEndErrors]);


  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div className="colorsettings_bodybackground">
        <NavContainer />
        <ErrorDisplay className="colorsettings_bodybackground"/>
        <SuccessDisplay />
        <div className="d-flex flex-wrap justify-content-start residencemanagercontainer">
          {
            ownerInputMode === constants.MODE_ASSIGN_OWNERS
            ?
              <UsersDisplay 
                addrData={ allAddressesDataDict }
                allOwnersResidencesDict={ allOwnersResidencesDict }
                allResidenceData={ allResidenceDataDict }
                handleUserClicked={ handleUserClicked }
                setFrontEndErrors={ setFrontEndErrors }
                setBackEndErrors={ setBackEndErrors }
                setSuccessMessages={ setSuccessMessages }
                userData={ allUserDataArray }
              />
            :
              <ResidencesDisplay
                addrData={ allAddressesDataDict }
                allResidenceOwnersDict={ allResidenceOwnersDict }
                handleResidenceClicked={ handleResidenceClicked }
                setFrontEndErrors={ setFrontEndErrors }
                setBackEndErrors={ setBackEndErrors }
                setSuccessMessages={ setSuccessMessages }
                residenceData={ allResidenceDataArray }
                userData={ allUserDataDict }
              />
          }
          <div className="d-flex me-5 flex-column flex-fill residenceformcontainer">
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode }
              parentHandlers={
                {
                  handleAssignOwnersClicked: handleAssignOwnersClicked,
                  handleDoneAssigningOwnersClicked: handleDoneAssigningOwnersClicked,
                  handleResidenceCreated: handleResidenceCreated,
                  handleResidenceDeleted: handleResidenceDeleted,
                  handleResidenceUpdated: handleResidenceUpdated,
                  handleSwitchResidenceModeToAddClicked: handleSwitchResidenceModeToAddClicked,
                  updateSingleResidenceInResidenceDataArray: updateSingleResidenceInResidenceDataArray
                }
              }
              parentState={
                {
                  ownerInputMode: ownerInputMode,
                  selectedOwnerInUsersDisplay: selectedOwnerInUsersDisplay,
                  selectedOwnerIDInOwnerSelect: selectedOwnerIDInOwnerSelect,
                  setSelectedOwnerIDInOwnerSelect: setSelectedOwnerIDInOwnerSelect,
                  selectedResidenceData: selectedResidenceData
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

export default ResidenceManager;