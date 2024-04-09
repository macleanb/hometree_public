/* External Imports */
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import ErrorDisplay from '../components/ErrorDisplay';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';
import { emptyAddrData } from '../utils/addressUtils';
import {
  emptyUserData,
  getUserByID,
  updateUser
} from '../utils/userUtils';
import styles from './SelfRegistration.module.css';

/*  This component renders an image and a generic FormContainer that allows
    new Users to create user objects and mailing Addresses (for themselves) */
const SelfRegistration = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth, setAuth } = useContext(AuthContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ formData, setFormData ] = useState(emptyUserData());
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_USER);
  const [ formMode, setFormMode ] = useState(constants.MODE_USER_SELF_REGISTER);
  // const [ selectedUserData, setSelectedUserData ] = useState(null);

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

  /* Updates the selectedUser with the provided updatedAddr */
  // const updateUserMailingAddress = async (updatedAddr) => {
  //   if (selectedUserData && updatedAddr) {
  //     /* Attempt to retrieve the user from the backend. */
  //     let userAPIResponse = await getUserByID(auth, selectedUserData.id, setBackEndErrors);

  //     /* This variable will hold the data of the user to update */
  //     let update_user_dict = null;
  //     if (await userAPIResponse) {
  //       update_user_dict = userAPIResponse;

  //       /* Remove any image from user data that was populated from the server
  //          before sending back */
  //       if ('image' in update_user_dict) {
  //         delete update_user_dict.image;
  //       }

  //       /* Update address ID on update_user_dict */
  //       update_user_dict.fk_mailing_address = updatedAddr.id;

  //       userAPIResponse = await updateUser(
  //         auth,
  //         selectedUserData.id,
  //         update_user_dict,
  //         setFrontEndErrors,
  //         setBackEndErrors,
  //         setSuccessMessages
  //       );
  //     }
  //   }
  // }

  //////////////////////
  /// Event Handlers ///
  //////////////////////

  // const handleAddressCreated = async (addrData) => {
  //   /* Add the new address to the selected user */
  //   await updateUserMailingAddress(addrData);

  //   /* Reset the form data and selectedAddrData */
  //   setFormData(null);

  //   /* Reset the formType to USER and the formMode to SELF_REGISTER */
  //   setFormMode(constants.MODE_USER_SELF_REGISTER);
  //   setFormType(constants.FORM_TYPE_USER);
  // }

  const handleUserCreated = (userData) => {
    /* Send the user to the login page.  They
       can finish loading their information (i.e. address)
       once they are authenticated. */
    setSuccessMessages({Success: 'Account created successfully.  Please login to complete the registration process.'});
    //navigate('/login');
  }

  //////////////////////
  /// Event Handlers ///
  //////////////////////

  const handleSuccessDisplayClosing = () => {
    navigate('/login');
  }


  /////////////////
  /* Use Effects */
  /////////////////

  /* See if the user is already logged in.  If so, redirect to home. */
  useEffect(() => {
    if (auth && auth.status && navigate) {
      if (auth.status === constants.STATUS_AUTHENTICATED) {      
        navigate('/home');
      }
    }
  }, [auth, navigate]); // Re-run each time a dependency comes to life


  ///////////////
  ///  Render ///
  ///////////////

  if (auth && auth.status && auth.status === constants.STATUS_NOT_AUTHENTICATED) {
    return (
      <div className="colorsettings_bodybackground">
        <ErrorDisplay className="colorsettings_bodybackground"/>
        <SuccessDisplay parentHandlers={
          {
            handleClose: handleSuccessDisplayClosing
          }
        }/>
        <div className="d-flex flex-wrap justify-content-start">
          <div className={`d-flex flex-column align-items-center flex-fill`}>
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode } 
              parentHandlers={
                {
                  handleUserCreated: handleUserCreated,
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

export default SelfRegistration;