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
import { emptyAddrData, getAddressByID } from '../utils/addressUtils';
import { getResponseError } from '../utils/errorUtils'; 
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import handlePasswordChange from '../utils/handlePasswordChange';
import {
  emptyUserData,
  getUserByID,
  updateUser,
} from '../utils/userUtils';
import ErrorDisplay from '../components/ErrorDisplay';
import NavContainer from '../components/NavContainer';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';



/*  This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
    UsersDisplay, and generic FormContainer that allows CRUD operations
    for Users, Addresses (on specific users), and Residences (on specific users) */
const UserProfileManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth, setAuth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { frontEndErrors, setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ formData, setFormData ] = useState(emptyUserData()); // must be elevated here because in some object managers (ResidenceManager) ownerInputMode state (Users/ResidencesDisplay state) can change while filling out a single form
  const [ formType, setFormType ] = useState(null);
  const [ formMode, setFormMode ] = useState(null);
  const [ selectedAddrData, setSelectedAddrData ] = useState(null);
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

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }

  /* Gets user data from backend and sets selectedUserData */
  const getUserDataFromBackend = async (user_id) => {
    let userData;

    await getUserByID(auth, user_id, setBackEndErrors).then( (apiResponse) => {
      if (apiResponse && apiResponse.id) {
        userData = apiResponse;

        /* Update selectedUserData state */
        setSelectedUserData(userData);
      } else {
        setSelectedUserData(emptyUserData());
      }
    }).catch((error) => {
      setBackEndErrors(getResponseError(error));
      setSelectedUserData(emptyUserData());

      // test
      console.log(error);
    });

    return userData;
  }

  /* Updates the selectedUser with the provided updatedAddr */
  const updateUserMailingAddress = async (updatedAddr) => {
    if (selectedUserData && updatedAddr) {
      /* Attempt to retrieve the user from the backend. */
      let userAPIResponse = await getUserByID(auth, selectedUserData.id, setBackEndErrors);

      /* This variable will hold the data of the user to update */
      let update_user_dict = {};
      if (await userAPIResponse) {
        update_user_dict = userAPIResponse;

        /* Remove any image from user data that was populated from the server
           before sending back */
        if ('image' in update_user_dict) {
          delete update_user_dict.image;
        }

        /* Remove encrypted password from dict */
        if ('password' in update_user_dict) {
          delete update_user_dict.password;
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


  //////////////////////
  /// Event Handlers ///
  //////////////////////

  const handleAddressCreated = async (addrData) => {
    /* Add the new address to the selected user */
    await updateUserMailingAddress(addrData);

    /* Update selectedUserData */
    const userID = selectedUserData?.id;

    if (userID) {
      getUserDataFromBackend(userID).then(() => {
          setFormMode(constants.MODE_USER_PROFILE);
          setFormType(constants.FORM_TYPE_USER);
        }
      ).catch((error) => {
        setBackEndErrors({Error: 'Could not retrieve user data.'});
        setFormMode(constants.MODE_USER_PROFILE);
        setFormType(constants.FORM_TYPE_USER);
      });
    }

    /* Reset the form data and selectedAddrData */
    //setFormData(null);
    setSelectedAddrData(null);
  }

  const handleAddressUpdated = (addrData) => {
    /* Update the user data from the backend, then
       reset the formType to USER and formMode to
       USER_PROFILE. selectedUserData should already
       be established.  */
    const user_id = selectedUserData?.id;

    if (user_id) {
      getUserDataFromBackend(user_id).then(() => {
          setFormMode(constants.MODE_USER_PROFILE);
          setFormType(constants.FORM_TYPE_USER);
        }
      ).catch((error) => {
        setBackEndErrors({Error: 'Could not retrieve user data.'});
        setFormMode(constants.MODE_USER_PROFILE);
        setFormType(constants.FORM_TYPE_USER);
      });
    }

    /* Reset selected address data */
    setSelectedAddrData(null);
  }

  const handleUserUpdated = async (userData) => {
    /* If the password was changed, login with new password */
    if (userData.user.password && userData.user.password.length > 0) {
      await handlePasswordChange(auth, userData.user.password, setBackEndErrors);
    }

    /* Update selectedUserData */
    setSelectedUserData(userData?.user);

    /* Update auth information to reflect changes to first name, last name, etc.
       This will force a rerender of the entire app, taking the user back to their home page. */
    setAuth({status: constants.STATUS_AWAITING_DATA});
  }



  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

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
    const addr_id = selectedUserData?.fk_mailing_address;

    if (addr_id) {
      /* Get the current address data from the backend */
      getAddressByID(auth, addr_id, setBackEndErrors).then( (apiResponse) => {

        if (apiResponse && apiResponse.id) {
          const addrData = apiResponse;

          /* Update selectedAddrData state */
          setSelectedAddrData(addrData);
          setFormMode(constants.MODE_ADDRESS_UPDATE);
          setFormType(constants.FORM_TYPE_ADDRESS_FOR_USER);
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
  }

  /* This will cancel the mailing address add/update and return to the user profile form. */
  const handleCancelAddressClicked = () => {
    /* If an address was selected in formType ADDRESS before the
    user was clicked, clear it out */
    setSelectedAddrData(null);
    
    //setFormData(emptyUserData());
    setFormMode(constants.MODE_USER_PROFILE);
    setFormType(constants.FORM_TYPE_USER);
  }

  /* This will skip the mailing address form. */
  const handleSkipAddressClicked = () => {
    setFormMode(constants.MODE_USER_PROFILE);
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
        /* Get the user ID from auth data */
        const userID = auth.user.id;

        /* Get the current user data from the backend */
        getUserDataFromBackend(userID).then((userData) => {
          if (userData) {
            if (!userData.fk_mailing_address) {
              setFormMode(constants.MODE_PROMPT_ADD_MAILING_ADDRESS_TO_USER);
              setFormType(constants.FORM_TYPE_ADDRESS_FOR_USER);
            } else {
              setFormMode(constants.MODE_USER_PROFILE);
              setFormType(constants.FORM_TYPE_USER);
            }
          }
        }).catch((error) => { setBackEndErrors({Error: 'Could not retrieve user data.'}) });
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
        <div className="d-flex flex-wrap justify-content-start userprofilemanagercontainer">
          <div className="d-flex me-5 flex-column flex-fill userformcontainer">
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode } 
              parentHandlers={
                {
                  handleAddressCreated: handleAddressCreated,
                  handleAddressUpdated: handleAddressUpdated,
                  handleAddMailingAddressClicked: handleAddMailingAddressClicked,
                  handleCancelAddressClicked: handleCancelAddressClicked,
                  handleSkipAddressClicked: handleSkipAddressClicked,
                  handleUpdateMailingAddressClicked: handleUpdateMailingAddressClicked,
                  handleUserUpdated: handleUserUpdated,
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
              parentState={
                {
                  selectedAddrData: selectedAddrData,
                  selectedUserData: selectedUserData,
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

export default UserProfileManager; 