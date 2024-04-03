////////////////
///  Imports ///
////////////////

/* External Libraries */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import constants from '../constants';
import {
  emptyUserData,
  getAllUsersAsArray,
  getAllUsersAsDict,
  getUserByID,
  getUserIndexFromAllUserDataArray,
  updateUser,
} from '../utils/userUtils';
import ErrorDisplay from '../components/ErrorDisplay';
import NavContainer from '../components/NavContainer';
import ResidencesDisplay from '../components/ResidencesDisplay';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';
import UsersDisplay from '../components/UsersDisplay';
import { emptyAddrData, getAddressByID, getAllAddressesAsDict } from '../utils/addressUtils';
import { getAllResidencesAsArray, getAllResidencesByOwnerAsDict, getAllResidenceOwnersAsDict } from '../utils/residenceUtils';


/*  This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
    UsersDisplay, and generic FormContainer that allows CRUD operations
    for Users, Addresses (on specific users), and Residences (on specific users) */
const UserManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { frontEndErrors, setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ allAddressesDataDict, setAllAddressesDataDict ] = useState(null);
  const [ allOwnersResidencesDict, setAllOwnersResidencesDict ] = useState(null);
  const [ allResidenceDataArr, setAllResidenceDataArr ] = useState(null);
  const [ allResidenceDataDict, setAllResidenceDataDict ] = useState(null);
  const [ allResidenceOwnersDict, setAllResidenceOwnersDict ] = useState(null); 
  const [ allUserDataArray, setAllUserDataArray ] = useState({users: [],});
  const [ allUserDataDict, setAllUserDataDict ] = useState({users: [],});
  const [ formData, setFormData ] = useState(emptyUserData()); // must be elevated here because in some object managers (ResidenceManager) ownerInputMode state (Users/ResidencesDisplay state) can change while filling out a single form
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_USER);
  const [ formMode, setFormMode ] = useState(constants.MODE_USER_ADD);
  const [ residenceInputMode, setResidenceInputMode ] = useState(null);
  const [ selectedAddrData, setSelectedAddrData ] = useState(null);
  const [ selectedResidenceIDInResidenceSelect, setSelectedResidenceIDInResidenceSelect ] = useState(null);
  const [ selectedResidenceInResidencesDisplay, setSelectedResidenceInResidencesDisplay ] = useState(null);
  const [ selectedUserData, setSelectedUserData ] = useState(null);

  /* Ref Declarations */
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputFirstNameRef = useRef(null);
  const inputLastNameRef = useRef(null);

  /* Other Declarations */
  const navigate = useNavigate();


  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Gets user data from backend and sets selectedUserData */
  const getUserDataFromBackend = async (user_id) => {
    getUserByID(auth, user_id, setBackEndErrors).then( (apiResponse) => {
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const userData = apiResponse;

        /* Update UsersDisplay with current data */
        updateSingleUserInUserDataArray(userData);

        /* Update selectedUserData state */
        setSelectedUserData(userData);
      } else {
        setSelectedUserData(emptyUserData());
      }
    }).catch((error) => {
      setBackEndErrors(error);
      setSelectedUserData(emptyUserData());

      // test
      console.log(error);
    });
  }

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
  const setAllResidenceDataAsArray = async (auth, setAllResidenceDataArr) => {
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
    
    setAllResidenceDataArr({residences: residencesArr});
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
    using the state setter function as the only argument  */
  const setAllResidenceDataAsDict = async (auth, setAllResidenceDataDict) => {
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

  /* Updates the selectedUser with the provided updatedAddr */
  const updateUserMailingAddress = async (updatedAddr) => {
    if (selectedUserData && updatedAddr) {
      /* Attempt to retrieve the user from the backend. */
      let userAPIResponse = await getUserByID(auth, selectedUserData.id, setBackEndErrors);

      /* This variable will hold the data of the user to update */
      let update_user_dict = null;
      if (await userAPIResponse) {
        update_user_dict = userAPIResponse;

        /* Remove any image from user data that was populated from the server
           before sending back */
        if ('image' in update_user_dict) {
          delete update_user_dict.image;
        }

        /* Update address ID on update_user_dict */
        update_user_dict.fk_mailing_address = updatedAddr.id;

        userAPIResponse = await updateUser(
          auth,
          selectedUserData.id,
          update_user_dict,
          setFrontEndErrors,
          setBackEndErrors,
          setSuccessMessages
        );
      }
    }
  }

  /* Updates a single user in the allUserDataArray array with new data  */
  const updateSingleUserInUserDataArray = async (updatedUser) => {
    if (updatedUser.id && allUserDataArray.users) {

      /* Get the index of the existing user */
      const oldUserIndex = getUserIndexFromAllUserDataArray(updatedUser.id, allUserDataArray.users);

      if (oldUserIndex) {
        /* Copy allUserData to a temp variable before updating */
        const tempAllUserDataArray = {...allUserDataArray}

        /* Replace the old user with a copy of the new user */
        tempAllUserDataArray.users[oldUserIndex] = {...updatedUser};

        setAllUserDataArray(tempAllUserDataArray);
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

  const handleUserCreated = (userData) => {
    /* Refresh data for UsersDisplay and ResidencesDisplay*/
    setUserDataAsArray(auth, setAllUserDataArray);
    setAllUserDataAsDict();
    setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
    setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);

    /* Transition to the next step of user creation: prompting the user
    to see if they want to add a mailing address to the new user they
    just created. */
    setFormData(emptyUserData());
    setFormMode(constants.MODE_PROMPT_ADD_MAILING_ADDRESS_TO_USER);
    setFormType(constants.FORM_TYPE_ADDRESS_FOR_USER);
    setSelectedUserData(userData);
  }

  const handleUserUpdated = (userData) => {
    /* Refresh data for UsersDisplay and ResidencesDisplay*/
    setUserDataAsArray(auth, setAllUserDataArray);
    setAllUserDataAsDict();
    setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
    setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);

    /* Update selectedUserData */
    setSelectedUserData(userData?.user);

    /* Leave the formType as USER and the formMode as
    UPDATE and the selectedUserID as-is 
    in case the user wants to make more changes */
  }

  const handleUserDeleted = () => {
    /* Refresh data for UsersDisplay and ResidencesDisplay*/
    setUserDataAsArray(auth, setAllUserDataArray);
    setAllUserDataAsDict();
    setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
    setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
    
    /* Reset formType to USER formMode to ADD */
    setFormData(emptyUserData());
    setFormMode(constants.MODE_USER_ADD);
    setFormType(constants.FORM_TYPE_USER);
    setSelectedUserData(null);
  }

  const handleAddressCreated = async (addrData) => {
    /* Add the new address to the selected user */
    await updateUserMailingAddress(addrData);

    /* Refresh data for UsersDisplay, ResidencesDisplay */
    setUserDataAsArray(auth, setAllUserDataArray);
    setAllUserDataAsDict();
    setAllAddressDataAsDict();

    /* Reset the form data and selectedAddrData */
    setFormData(null);
    setSelectedAddrData(null);

    /* Reset the formType to USER and the formMode to ADD */
    setFormMode(constants.MODE_USER_ADD);
    setFormType(constants.FORM_TYPE_USER);
  }

  const handleAddressUpdated = (addrData) => {
    /* Refresh UsersDisplay */
    setUserDataAsArray(auth, setAllUserDataArray);

    /* Refresh ResidencesDisplay */
    setAllUserDataAsDict();

    /* Set all address data as dict */
    setAllAddressDataAsDict();
    
    /* Update the user data from the backend, then
       reset the formType to USER and formMode to
       UPDATE_DELETE. selectedUserData should already
       be established.  */
    const user_id = selectedUserData?.id;

    if (user_id) {
      getUserDataFromBackend(user_id).then(() => {
          setFormMode(constants.MODE_USER_UPDATE_DELETE);
          setFormType(constants.FORM_TYPE_USER);
        }
      ).catch((error) => {
        setBackEndErrors({Error: 'Could not retrieve user data.'});
        setFormMode(constants.MODE_USER_UPDATE_DELETE);
        setFormType(constants.FORM_TYPE_USER);
      });
    }

    /* Reset selected address data */
    setSelectedAddrData(null);
  }

  const handleAddressDeleted = () => {
    /* Refresh UsersDisplay */
    setUserDataAsArray(auth, setAllUserDataArray);

    /* Refresh ResidencesDisplay */
    setAllUserDataAsDict();

    /* Set all address data as dict */
    setAllAddressDataAsDict();

    /* Update the user data from the backend, then
       reset the formType to USER and formMode to
       UPDATE_DELETE. selectedUserData should already
       be established.  */
    const user_id = selectedUserData?.id;

    if (user_id) {
      getUserDataFromBackend(user_id).then(() => {
          setFormMode(constants.MODE_USER_UPDATE_DELETE);
          setFormType(constants.FORM_TYPE_USER);
        }
      ).catch((error) => {
        setBackEndErrors({Error: 'Could not retrieve user data.'});
        setFormMode(constants.MODE_USER_UPDATE_DELETE);
        setFormType(constants.FORM_TYPE_USER);
      });
    }

    /* Reset selected address data */
    setFormData(null);
    setSelectedAddrData(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  /* This function switches the usersDisplay to a residencesDisplay
    so the user can click on which residences they want to assign to users (as owner). */
  const handleAssignResidencesClicked = () => {
    setResidenceInputMode(constants.MODE_ASSIGN_RESIDENCES);
    setAllResidenceDataAsArray(auth, setAllResidenceDataArr);
    setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
  }

  /* This function switches the residencesDisplay back to usersDisplay
    once the user is done adding owners. */
  const handleDoneAssigningResidencesClicked = () => {
    setResidenceInputMode(null);
  }

  /* Switch to formType user, formMode update/delete and set
     selected user to data from backend. */
  const handleUserClicked = async (user_dict) => {
    /* If an address was selected in formType ADDRESS before the
       user was clicked, clear it out */
    setSelectedAddrData(null);

    if (user_dict) {
      /* Get the current user data from the backend */
      getUserDataFromBackend(user_dict.id).then(() => {
          setFormMode(constants.MODE_USER_UPDATE_DELETE);
          setFormType(constants.FORM_TYPE_USER);
        }
      ).catch((error) => { setBackEndErrors({Error: 'Could not retrieve user data.'}) });
    }

    clearErrorStates();
  }

  /* Handles a click on a user button in UsersDisplay */
  const handleResidenceClicked = (residenceDict) => {
    const tempSelectedResidence = { ...residenceDict };
    setSelectedResidenceInResidencesDisplay(tempSelectedResidence);
  }

  /* This switches the user form mode back to 'ADD' if the user clicks the
      "Add New User" button while in the 'UPDATE OR DELETE' mode. */
  const handleSwitchUserModeToAddClicked = (e) => {
    setFormData(emptyUserData());
    setFormMode(constants.MODE_USER_ADD);
    setSelectedUserData(null);
    clearErrorStates();
  }

  /* This will load the form for adding a mailing address for a user. */
  const handleAddMailingAddressClicked = () => {
    setFormMode(constants.MODE_ADDRESS_ADD);
    setFormType(constants.FORM_TYPE_ADDRESS_FOR_USER);
    setSelectedAddrData(emptyAddrData());
    setFormData(emptyAddrData());
    clearErrorStates();
  }

  /* This will load the form for updating/deleting a mailing address for a user. */
  const handleUpdateMailingAddressClicked = () => {
    setFormData(emptyAddrData());
    const addr_id = selectedUserData?.fk_mailing_address;

    if (addr_id) {
      /* Get the current address data from the backend */
      getAddressByID(auth, addr_id, setBackEndErrors).then( (apiResponse) => {
        if (apiResponse && !backEndErrors && apiResponse.id) {
          const addrData = apiResponse;

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
    }

    setFormMode(constants.MODE_ADDRESS_UPDATE_DELETE);
    setFormType(constants.FORM_TYPE_ADDRESS_FOR_USER);
  }

  /* This will cancel the mailing address add/update/delete and return to the user update/delete form. */
  const handleCancelAddressClicked = () => {
    /* If an address was selected in formType ADDRESS before the
    user was clicked, clear it out */
    setSelectedAddrData(null);
    
    //setFormData(emptyUserData());
    setFormMode(constants.MODE_USER_UPDATE_DELETE);
    setFormType(constants.FORM_TYPE_USER);
  }

  /* This will skip the mailing address form and present a residence form option. */
  const handleSkipAddressClicked = () => {
    setResidenceInputMode(null);
    setFormMode(constants.MODE_USER_ADD);
    setFormType(constants.FORM_TYPE_USER);
  }


  /////////////////
  /* Use Effects */
  /////////////////

  /* Ensure the user is authenticated.  If so, load all users for 
     display.  Also load all address data.  If not, redirect to login. */
  useEffect(() => {
    if (auth && auth.status && navigate) {
      if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
        navigate('/login');
      } else {
        getAllUsersAsArray(auth).then((result) => {
          setAllUserDataArray({users: result});
        }).catch((error) => { setBackEndErrors({Error: 'Could not retrieve user data.'}) });

        /* Set data for UsersDisplay and ResidencesDisplay*/
        setAllAddressDataAsDict();
        setAllUserDataAsDict();
        setAllResidenceDataAsDict(auth, setAllResidenceDataDict);
        setAllResidenceOwnersAsDict(auth, setAllResidenceOwnersDict);
        setAllResidencesByOwnersAsDict(auth, setAllOwnersResidencesDict);
      }
    }
  }, [auth, navigate, setBackEndErrors]);


  ///////////////
  ///  Render ///
  ///////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div className="colorsettings_bodybackground">
        <NavContainer />
        <ErrorDisplay className="colorsettings_bodybackground"/>
        <SuccessDisplay />
        <div className="d-flex flex-wrap justify-content-start usermanagercontainer">
        {
            residenceInputMode === constants.MODE_ASSIGN_RESIDENCES
            ?
              <ResidencesDisplay
                addrData={ allAddressesDataDict }
                allResidenceOwnersDict={ allResidenceOwnersDict }
                handleResidenceClicked={ handleResidenceClicked }
                setFrontEndErrors={ setFrontEndErrors }
                setBackEndErrors={ setBackEndErrors }
                setSuccessMessages={ setSuccessMessages }
                residenceData={ allResidenceDataArr }
                userData={ allUserDataDict }
              />
            :
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
          }
          <div className="d-flex me-5 flex-column flex-fill userformcontainer">
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode } 
              parentHandlers={
                {
                  handleAddressCreated: handleAddressCreated,
                  handleAddressUpdated: handleAddressUpdated,
                  handleAddressDeleted: handleAddressDeleted,
                  handleAddMailingAddressClicked: handleAddMailingAddressClicked,
                  handleAssignResidencesClicked: handleAssignResidencesClicked,
                  handleCancelAddressClicked: handleCancelAddressClicked,
                  handleDoneAssigningResidencesClicked: handleDoneAssigningResidencesClicked,
                  handleSkipAddressClicked: handleSkipAddressClicked,
                  handleSwitchUserModeToAddClicked: handleSwitchUserModeToAddClicked,
                  handleUpdateMailingAddressClicked: handleUpdateMailingAddressClicked,
                  handleUserCreated: handleUserCreated,
                  handleUserUpdated: handleUserUpdated,
                  handleUserDeleted: handleUserDeleted,
                  updateSingleUserInUserDataArray: updateSingleUserInUserDataArray,
                }
              }
              parentState={
                {
                  allResidenceDataDict: allResidenceDataDict,
                  residenceInputMode: residenceInputMode,
                  selectedAddrData: selectedAddrData,
                  selectedResidenceIDInResidenceSelect: selectedResidenceIDInResidenceSelect,
                  selectedResidenceInResidencesDisplay: selectedResidenceInResidencesDisplay,
                  selectedUserData: selectedUserData,
                  setSelectedResidenceIDInResidenceSelect: setSelectedResidenceIDInResidenceSelect,
                }
              }
              parentRefs={
                {
                  inputEmailRef: inputEmailRef,
                  inputPasswordRef: inputPasswordRef,
                  inputFirstNameRef: inputFirstNameRef,
                  inputLastNameRef: inputLastNameRef,
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

export default UserManager; 