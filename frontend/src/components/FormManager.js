/* External Libraries */
import React, { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import addAnnouncement from '../utils/announcement/addAnnouncement';
import addPolicy from '../utils/policy/addPolicy';
import addPolicyOption from '../utils/policy/addPolicyOption';
import AddressForm from '../forms/AddressForm';
import {
  addAddress,
  addrDataIsEmpty,
  updateAddress,
  deleteAddress,
  emptyAddrData 
} from '../utils/addressUtils';
import announcementDataIsEmpty from '../utils/announcement/announcementDataIsEmpty';
import AnnouncementForm from '../forms/AnnouncementForm';
import arrHasElementID from '../utils/arrHasElementID';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import deleteAnnouncement from '../utils/announcement/deleteAnnouncement';
import deletePolicy from '../utils/policy/deletePolicy';
import deletePolicyOption from '../utils/policy/deletePolicyOption';
import emptyAnnouncementData from '../utils/announcement/emptyAnnouncementData';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import getPolicyOptions from '../utils/policy/getPolicyOptions';
import policyDataIsEmpty from '../utils/policy/policyDataIsEmpty';
import PolicyForm from '../forms/PolicyForm';
import removeObjAtIndexFromArr from '../utils/removeObjAtIndexFromArr';
import removeObjsWithIDFromArray from '../utils/removeObjsWithIDFromArray';
import reportAddressFormValidity from '../utils/address/reportAddressFormValidity';
import reportAnnouncementFormValidity from '../utils/announcement/reportAnnouncementFormValidity';
import reportPolicyFormValidity from '../utils/policy/reportPolicyFormValidity';
import reportUserFormValidity from '../utils/reportUserFormValidity';
import ResidenceForm from '../forms/ResidenceForm';
import {
  addResidence,
  deleteResidence,
  emptyResidenceData,
  getResidencesForUser,
  getUsersForResidence,
  residenceAlreadyExists,
  residenceDataIsEmpty,
  updateResidence
} from '../utils/residenceUtils';
import styles from './FormManager.module.css';
import SuccessContext from '../contexts/SuccessProvider';
import updateAnnouncement from '../utils/announcement/updateAnnouncement';
import updatePolicy from '../utils/policy/updatePolicy';
import UserForm from '../forms/UserForm';
import indexOfObj from '../utils/indexOfObj';
import {
  addUser,
  deleteUser,
  emptyUserData,
  registerUser,
  removeUserFromArray,
  updateUser,
  userArrayHasUserID,
  userDataIsEmpty,
} from '../utils/userUtils';
import emptyPolicyData from '../utils/policy/emptyPolicyData';


/* This component is a flexible-use form manager for
   User, Address, and Residence objects. */
const FormManager = ({
  formData,
  formType,
  formMode,
  parentHandlers,
  parentRefs,
  parentState,
  setFormData }) => 
{

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);


  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);

    if (parentRefs?.inputEmailRef?.current) {
      parentRefs.inputEmailRef.current.setCustomValidity('');
    }

    if (parentRefs?.inputPasswordRef?.current) {
      parentRefs.inputPasswordRef.current.setCustomValidity('');
    }

    if (parentRefs?.inputFirstNameRef?.current) {
      parentRefs.inputFirstNameRef.current.setCustomValidity('');
    }

    if (parentRefs?.inputLastNameRef?.current) {
      parentRefs.inputLastNameRef.current.setCustomValidity('');
    }
  }

  /* Loads address data into formData from parent state */
  const loadAddressDataToForm = () => {
    if (parentState.selectedAddrData && !addrDataIsEmpty(parentState.selectedAddrData)) {
      const tempAddrData = { ...parentState.selectedAddrData };

      /* Update backendImageExists based on whether the selected address
        has an image attribute and whether that attribute is null.  If
        a backendImage does exist, delete it from the tempAddrData because
        any changes will be made using the image selector on the form. */
      if ('image' in tempAddrData && tempAddrData.image) {
        tempAddrData['backendImageExists'] = true;
        delete tempAddrData.image;
      } else {
        tempAddrData['backendImageExists'] = false;
      }

      /* Since tempAddrData may not contain all fields (i.e. image), preserve
        defaults from emptyAddressData() rather than deleting them */
      if (formData && tempAddrData) {
        setFormData({...formData, ...tempAddrData});
      }
    }
  }

  /* Loads announcement data into formData from parent state */
  const loadAnnouncementDataToForm = () => {
    if (parentState.selectedAnnouncementData && !announcementDataIsEmpty(parentState.selectedAnnouncementData)) {
      const tempAnnouncementData = { ...parentState.selectedAnnouncementData };

      /* Update backendImageExists based on whether the selected announcement
        has an image attribute and whether that attribute is null.  If
        a backendImage does exist, delete it from the tempAnnouncementData because
        any changes will be made using the image selector on the form. */
      if ('image' in tempAnnouncementData && tempAnnouncementData.image) {
        tempAnnouncementData['backendImageExists'] = true;
        delete tempAnnouncementData.image;
      } else {
        tempAnnouncementData['backendImageExists'] = false;
      }

      /* Since tempAnnouncementData may not contain all fields (i.e. image), preserve
        defaults from emptyAnnouncementData() rather than deleting them */
      if (formData && tempAnnouncementData) {
        setFormData({...formData, ...tempAnnouncementData});
      }
    }
  }

    /* Loads policy data into formData from parent state */
  const loadPolicyDataToForm = async () => {
    if (parentState.selectedPolicyData && !policyDataIsEmpty(parentState.selectedPolicyData)) {
      const tempPolicyData = { ...parentState.selectedPolicyData };

      /* Update backendImageExists based on whether the selected policy
        has an image attribute and whether that attribute is null.  If
        a backendImage does exist, delete it from the tempPolicyData because
        any changes will be made using the image selector on the form. */
      if ('image' in tempPolicyData && tempPolicyData.image) {
        tempPolicyData['backendImageExists'] = true;
        delete tempPolicyData.image;
      } else {
        tempPolicyData['backendImageExists'] = false;
      }

      /* Insert any options data from backend */
      const options = await getPolicyOptions(parentState.selectedPolicyData.id, setBackEndErrors);
      tempPolicyData['options'] = options;

      /* Since tempPolicyData may not contain all fields (i.e. image), preserve
        defaults from emptyPolicyData() rather than deleting them */
      if (formData && tempPolicyData) {
        setFormData({...formData, ...tempPolicyData});
      }
    }
  }

  /* Loads user data into formData from parent state */
  const loadUserDataToForm = async () => {
    if (parentState.selectedUserData && !userDataIsEmpty(parentState.selectedUserData)) {
      const tempUserData = { ...parentState.selectedUserData };

      /* Update backendImageExists based on whether the selected user
         has an image attribute and whether that attribute is null.  If
         a backendImage does exist, delete it from the tempUserData because
         any changes will be made using the image selector on the form. */
      if ('image' in tempUserData && tempUserData.image) {
        tempUserData['backendImageExists'] = true;
        delete tempUserData.image;
      } else {
        tempUserData['backendImageExists'] = false;
      }

      /* Remove any password data because it's just a hash anyway */
      if ('password' in tempUserData) {
        delete tempUserData.password;
      }

      /* Get all the residences owned by the current user from the backend */
      if (parentState.allResidenceDataDict) {
        const residenceIDs = await getResidencesForUser(auth, setBackEndErrors, parentState.selectedUserData.id);

        /* Pull in expanded residence/address data from the raw residence IDs */
        if (residenceIDs?.length > 0) {
          const residences = [];

          for (const residenceID of residenceIDs) {
            residences.push(parentState.allResidenceDataDict.residences[residenceID.toString()]);
          }
          
          if (residences?.length > 0) {
            tempUserData.residences = residences;
          }
        }
      }
  
      /* Since tempUserData may not contain all fields (i.e. image), make sure 
         to preserve defaults from emptyUserData() rather than deleting them */
      setFormData({ ...formData, ...tempUserData});
    }
  }

  /* Loads residence data into formData from parent state */
  const loadResidenceDataToForm = async () => {
    if (parentState.selectedResidenceData && !residenceDataIsEmpty(parentState.selectedResidenceData)) {
      const tempResidenceData = { ...parentState.selectedResidenceData };

      /* Update backendImageExists based on whether the selected residence
        has an image attribute and whether that attribute is null.  If
        a backendImage does exist, delete it from the tempResidenceData because
        any changes will be made using the image selector on the form. */
      if ('image' in tempResidenceData && tempResidenceData.image) {
        tempResidenceData['backendImageExists'] = true;
        delete tempResidenceData.image;
      } else {
        tempResidenceData['backendImageExists'] = false;
      }

      /* Get all the owners of the residence from the backend */
      const owners = await getUsersForResidence(auth, parentState.selectedResidenceData.id, setBackEndErrors);

      if (owners && owners.length > 0) {
        tempResidenceData.owners = owners;
      }
  
      /* Since tempResidenceData may not contain all fields, make sure 
         to preserve defaults from emptyResidenceData() rather than deleting them */
      setFormData({ ...formData, ...tempResidenceData});
    }
  }

  /* Returns true if the formData is user data */
  const formDataIsUser = () => {
    if (formData) {
      if ('email' in formData) {
        return true;
      }
      return false;
    }
  }

  /* Returns true if the formData is address data */
  const formDataIsAddress = () => {
    if (formData) {
      if ('street' in formData) {
        return true;
      }
      return false;
    }
  }

  /* Returns true if the formData is announcement data */
  const formDataIsAnnouncement = () => {
    if (formData) {
      if ('title' in formData) {
        return true;
      }
      return false;
    }
  }

  /* Returns true if the formData is policy data */
  const formDataIsPolicy = () => {
    if (formData) {
      if ('statement' in formData && 'question' in formData) {
        return true;
      }
      return false;
    }
  }

  /* Returns true if the formData is residence data */
  const formDataIsResidence = () => {
    if (formData) {
      if ('fk_Address' in formData) {
        return true;
      }
      return false;
    }
  }

  /* Returns true if the formData is residences (multiple) data */
  const formDataIsResidences = () => {
    if (formData) {
      if (Array.isArray(formData)) {
        return true;
      }
      return false;
    }
  }

  ///////////////////////////////////////
  /// User Input Updates on Form Data ///
  ///////////////////////////////////////

  /* Handles changes to UserForm */
  const onUserFormChange = e => {
    if (e && e.target?.name === 'image') {
      setFormData({ 
        ...formData, 
        imageFileName: e.target.value,
        image: e.target.files['0'],
      });
    } else if (e && e.target?.name === 'deleteExistingImageCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({ 
          ...formData,
          imageFileName: '',
          image: null,
          deleteExistingImage: true
        });
      } else { // User had wanted to set image to null but changed mind
        setFormData({ 
          ...formData,
          deleteExistingImage: false
        });
      }
    } else if (e && e.target?.name === 'isActiveCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({ 
          ...formData,
          is_active: true
        });
      } else {
        setFormData({ 
          ...formData,
          is_active: false
        });
      }
    } else if (e && e.target?.name === 'isStaffCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({ 
          ...formData,
          is_staff: true
        });
      } else {
        setFormData({ 
          ...formData,
          is_staff: false
        });
      }
    } else {
      /* For all other field changes, use the generic set function */
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  
    /* Clear the error state after the user modifies the
      username or password fields */
    clearErrorStates();
  }

  /* Handles changes to AddressForm */
  const onAddressFormChange = e => {
    if (e && e.target?.name === 'image') {
      setFormData({
        ...formData,
        imageFileName: e.target.value,
        image: e.target.files['0']
      });
    } else if (e && e.target?.name === 'deleteExistingImageCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({
          ...formData,
          imageFileName: '',
          image: null,
          deleteExistingImage: true
        });
      } else { // User had wanted to set image to null but changed mind
        setFormData({
          ...formData,
          deleteExistingImage: false
        });
      }
    } else {
      /* For all other field changes, use the generic set function */
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }

    /* Clear the error state after the user modifies the fields */
    clearErrorStates();
  }

  /* Handles changes to AnnouncementForm */
  const onAnnouncementFormChange = e => {
    if (e && e.target?.name === 'image') {
      setFormData({
        ...formData,
        imageFileName: e.target.value,
        image: e.target.files['0']
      });
    } else if (e && e.target?.name === 'deleteExistingImageCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({
          ...formData,
          imageFileName: '',
          image: null,
          deleteExistingImage: true
        });
      } else { // User had wanted to set image to null but changed mind
        setFormData({
          ...formData,
          deleteExistingImage: false
        });
      }
    } else {
      /* For all other field changes, use the generic set function */
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }

    /* Clear the error state after the user modifies the fields */
    clearErrorStates();
  }

  /* Handles changes to PolicyForm */
  const onPolicyFormChange = e => {
    if (e && e.target?.name === 'image') {
      setFormData({
        ...formData,
        imageFileName: e.target.value,
        image: e.target.files['0']
      });
    } else if (e && e.target?.name === 'deleteExistingImageCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({
          ...formData,
          imageFileName: '',
          image: null,
          deleteExistingImage: true
        });
      } else { // User had wanted to set image to null but changed mind
        setFormData({
          ...formData,
          deleteExistingImage: false
        });
      }
    } else {
      /* For all other field changes, use the generic set function */
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }

    /* Clear the error state after the user modifies the fields */
    clearErrorStates();
  }

  /* Handles changes to AddressForm */
  const onResidenceFormChange = e => {
    if (e && e.target?.name === 'image') {
      setFormData({
        ...formData,
        imageFileName: e.target.value,
        image: e.target.files['0']
      });
    } else if (e && e.target?.name === 'deleteExistingImageCheckbox') {
      const checked = e.target.checked;

      if (checked) {
        setFormData({
          ...formData,
          imageFileName: '',
          image: null,
          deleteExistingImage: true
        });
      } else { // User had wanted to set image to null but changed mind
        setFormData({
          ...formData,
          deleteExistingImage: false
        });
      }
    } else {
      /* For all other field changes, use the generic set function */
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }

    /* Clear the error state after the user modifies the fields */
    clearErrorStates();
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  /* Adds an announcement */
  const handleAddAnnouncementClicked = async (event) => { 
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportAnnouncementFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {

      apiResponse = await addAnnouncement(
        auth,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages
      );

      /* Must include apiResponse here to wait for it, otherwise it will 
        fire immediately before backEndErrors has even been set. */
      if (apiResponse?.id) {
        const announcementData = apiResponse;
        setFormData(null);
        parentHandlers.handleAnnouncementCreated(announcementData);
      }
    }
  }

  /* Updates an announcement. */
  const handleUpdateAnnouncementClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportAnnouncementFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {
      apiResponse = await updateAnnouncement(
        auth,
        parentState.selectedAnnouncementData.id,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages,
      );

      /* Notify the parent component that the announcement has been updated */
      if (apiResponse?.id) {
        const announcementData = apiResponse;
        parentHandlers.handleAnnouncementUpdated(announcementData);
      }
    }
  }

  /* Deletes an announcement */
  const handleDeleteAnnouncementClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    apiResponse = await deleteAnnouncement(
      auth,
      parentState.selectedAnnouncementData.id,
      setFrontEndErrors,
      setBackEndErrors,
      setSuccessMessages,
    );

    /* Notify the parent component that the announcement has been deleted */
    if (apiResponse) {
      setFormData(null);
      parentHandlers.handleAnnouncementDeleted();
    }
  }

  /* Adds a policy */
  const handleAddPolicyClicked = async (event) => { 
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportPolicyFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {

      apiResponse = await addPolicy(
        auth,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages
      );

      /* Must include apiResponse here to wait for it, otherwise it will 
        fire immediately before backEndErrors has even been set. */
      if (apiResponse?.id) {
        const policyData = apiResponse;

        if (formData?.options && formData.options.length > 0) {
          for (const option of formData.options) {
            await addPolicyOption (
              auth,
              option,
              policyData.id,
              setFrontEndErrors,
              setBackEndErrors
            );
          }
        }

        setFormData(null);
        parentHandlers.handlePolicyCreated(policyData);
      }
    }
  }

  /* Updates a policy. */
  const handleUpdatePolicyClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportPolicyFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {
      apiResponse = await updatePolicy(
        auth,
        parentState.selectedPolicyData.id,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages,
      );
      
      /* Now update any policy options. */
      if (apiResponse?.id) {
        const policyData = apiResponse;

        /* First identify & delete policy options from backend */
        const policyOptionsToDeleteFromBackend = [];
        const backendPolicyOptions = await getPolicyOptions(policyData.id, setBackEndErrors);
        for (const backendOption of backendPolicyOptions) {
          if (!Array.isArray(formData?.options)) {
            policyOptionsToDeleteFromBackend.push(backendOption);
          } else if (!arrHasElementID(formData.options, backendOption.id)) {
            policyOptionsToDeleteFromBackend.push(backendOption);
          }
        }
        for (const optionToDelete of policyOptionsToDeleteFromBackend) {
          await deletePolicyOption(
            auth,
            policyData.id,
            optionToDelete.id,
            setFrontEndErrors,
            setBackEndErrors);
        }

        /* Now add new policy options. */
        if (formData?.options && formData.options.length > 0) {
          for (const option of formData.options) {
            if (option.id === null) {
              await addPolicyOption (
                auth,
                option,
                policyData.id,
                setFrontEndErrors,
                setBackEndErrors
              );
            }
          }
        }

        /* Notify the parent component that the policy has been updated */
        parentHandlers.handlePolicyUpdated(policyData);
      }
    }
  }

  /* Deletes a policy */
  const handleDeletePolicyClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    apiResponse = await deletePolicy(
      auth,
      parentState.selectedPolicyData.id,
      setFrontEndErrors,
      setBackEndErrors,
      setSuccessMessages,
    );

    /* Notify the parent component that the policy has been deleted */
    if (apiResponse) {
      setFormData(null);
      parentHandlers.handlePolicyDeleted();
    }
  }

  /* Adds a user and begins a multi-step process for 
     adding a mailing address and residences to the
     selected user. */
  const handleAddUserClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    /* Check for validation errors and report as needed. */
    const formIsValid = reportUserFormValidity(formData, parentRefs);

    if (formData && formIsValid) {
      if (formMode === constants.MODE_USER_ADD) {
        apiResponse = await addUser( // Administrators adding users
          auth,
          formData,
          setFrontEndErrors,
          setBackEndErrors,
          setSuccessMessages
        );
      } else if (formMode === constants.MODE_USER_SELF_REGISTER) {
        apiResponse = await registerUser( // Users self-registering
          auth,
          formData,
          setFrontEndErrors,
          setBackEndErrors,
          setSuccessMessages
        );
      }

      /* Notify the parent component that the user has been created & reset the form */
      if (await apiResponse && !backEndErrors && apiResponse.id) {
        const userData = apiResponse;
        setFormData(null);
        parentHandlers.handleUserCreated(userData);
      }
    }
  }

  /* Updates the selected user. */
  const handleUpdateUserClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    /* Check for validation errors and report as needed. */
    const formIsValid = reportUserFormValidity(formData, parentRefs);
    
    if (formData && formIsValid) {
      apiResponse = await updateUser(
        auth,
        parentState.selectedUserData.id,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages
      );

      /* Notify the parent component that the user has been updated */
      if (await apiResponse && !backEndErrors && apiResponse.user?.id) {
        const userData = apiResponse;

        /* Replace the hashed password received from the API response
           with the actual password sent to the server */
        if (formData.password && formData.password.length > 0) {
          userData.user['password'] = formData.password;
        } else {
          userData.user['password'] = '';
        }

        parentHandlers.handleUserUpdated(userData);
      }
    }
  }

  /* Deletes the selected user.  Also deletes the user's mailing address
     on the backend, if the user had one. */
  const handleDeleteUserClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    apiResponse = await deleteUser(
      auth,
      parentState.selectedUserData.id,
      setFrontEndErrors,
      setBackEndErrors,
      setSuccessMessages
    );

    /* Reload user data so the UsersDisplay can display it */
    if (apiResponse && !backEndErrors) {
      setFormData(null);
      parentHandlers.handleUserDeleted();
    }
  }

  /* This is for adding an address (may be associated with a user) */
  const handleAddAddressClicked = async (event) => { 
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportAddressFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {
      /* Allow duplicate addresses.  Otherwise, users sharing the same address
        wouldn't be able to update their address without affecting other users. */
      apiResponse = await addAddress(
        auth,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages
      );

      /* Must include apiResponse here to wait for it, otherwise it will 
        fire immediately before backEndErrors has even been set. */
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const addrData = apiResponse;
        setFormData(null);
        parentHandlers.handleAddressCreated(addrData);
      }
    }
  }

  /* This is for updating an address, which may or may not be
      associated with a user. */
  const handleUpdateAddressClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportAddressFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {
      apiResponse = await updateAddress(
        auth,
        parentState.selectedAddrData.id,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages,
      );

      /* Notify the parent component that the address has been updated */
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const addrData = apiResponse;
        parentHandlers.handleAddressUpdated(addrData);
      }
    }
  }

  /* This is for deleting an address, which may or may not be
      associated with a user. */
  const handleDeleteAddressClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    apiResponse = await deleteAddress(
      auth,
      parentState.selectedAddrData.id,
      setFrontEndErrors,
      setBackEndErrors,
      setSuccessMessages,
    );

    /* Notify the parent component that the address has been updated */
    if (apiResponse && !backEndErrors) {
      setFormData(null);
      parentHandlers.handleAddressDeleted();
    }
  }

  /* Adds an option to formData.options for PolicyForm */
  const handleAddOptionClicked = async (event) => {
    if (formData?.option_text && formData.option_text.length > 0) {
      if (formData?.options && Array.isArray(formData.options)) {
        formData.options.push({
          id: null,
          option_text: formData.option_text
        });
      } else {
        formData.options = [{ id: null,
          option_text: formData.option_text
        }];
      }
    }

    setFormData({...formData, option_text: ''});
  }

  /* Removes an option from formData.options for PolicyForm */
  const handleRemoveOptionClicked = async (event) => {
    if (formData?.options?.length > 0) {
      const indexToRemove = parentState.selectedOptionInOptionSelect ? parentState.selectedOptionInOptionSelect : 0;
      const newOptionsArr = removeObjAtIndexFromArr(indexToRemove, formData.options, setFrontEndErrors);
      setFormData({...formData, options: newOptionsArr});
      parentState.setSelectedOptionInOptionSelect(null);
    }
  }

  /* This is for adding a a residence */
  const handleAddResidenceClicked = async (event) => { 
    event.preventDefault();
    let apiResponse = null;
    
    const formIsValid = await reportAddressFormValidity(formData, null, setBackEndErrors);

    /* See if the residence already exists */
    if (await residenceAlreadyExists(formData, auth, setBackEndErrors)) {
      setFrontEndErrors({Error: 'Residence already exists.  Please input a different address.'});
      formIsValid = false;
    }

    if (formData && formIsValid) {
      /* Do NOT allow duplicate addresses. */
      apiResponse = await addResidence(
        auth,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages
      );

      /* Must include apiResponse here to wait for it, otherwise it will 
        fire immediately before backEndErrors has even been set. */
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const residenceData = apiResponse;
        setFormData(null);
        parentHandlers.handleResidenceCreated(residenceData);
      }
    }
  }

  /* This is for deleting a residence, which may or may not be
      associated with a user. */
  const handleDeleteResidenceClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    apiResponse = await deleteResidence(
      auth,
      parentState.selectedResidenceData,
      setFrontEndErrors,
      setBackEndErrors,
      setSuccessMessages,
    );

    /* Notify the parent component that the residence has been deleted */
    if (apiResponse && !backEndErrors) {
      setFormData(null);
      parentHandlers.handleResidenceDeleted();
    }
  }

  /* Removes the selected owner from the selected residence */
  const handleRemoveOwnerClicked = async (event) => {
    if (parentState?.selectedOwnerIDInOwnerSelect) {
      try {
        const updatedOwners = removeUserFromArray(parseInt(parentState.selectedOwnerIDInOwnerSelect), formData.owners);
        setFormData({...formData, owners: updatedOwners});
      } catch (e) {
        setFrontEndErrors({Error: e});
      }
    }
  }

  /* Removes the selected residence from the selected owner */
  const handleRemoveResidenceClicked = async (event) => {
    if (parentState?.selectedResidenceIDInResidenceSelect) {
      try {
        const updatedResidences = removeObjsWithIDFromArray(
          parseInt(parentState.selectedResidenceIDInResidenceSelect),
          formData.residences
        );
        setFormData({...formData, residences: updatedResidences});
      } catch (e) {
        setFrontEndErrors({Error: e});
      }
    }
  }

  /* This is for updating a residence, which may or may not be
    associated with a user. */
  const handleUpdateResidenceClicked = async (event) => {
    event.preventDefault();
    let apiResponse = null;

    const formIsValid = await reportAddressFormValidity(formData, null, setBackEndErrors);

    if (formData && formIsValid) {
      apiResponse = await updateResidence(
        auth,
        parentState.selectedResidenceData,
        formData,
        setFrontEndErrors,
        setBackEndErrors,
        setSuccessMessages,
      );

      /* Notify the parent component that the residence has been updated */
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const residenceData = apiResponse;
        parentHandlers.handleResidenceUpdated(residenceData);
      }
    }
  }

  /* This responds if user clicks button to clear a selected image file. */
  const handleClearImageClicked = (e) => {
    setFormData({ 
      ...formData,
      imageFileName: '',
      image: null,
    });
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* If the formType changes, set formData to empty for whatever the new formType is */
  useEffect(() => {
    if (formType === constants.FORM_TYPE_ADDRESS || formType === constants.FORM_TYPE_ADDRESS_FOR_USER) {
      setFormData(emptyAddrData());
    } else if (formType === constants.FORM_TYPE_ANNOUNCEMENT) {
      setFormData(emptyAnnouncementData());
    } else if (formType === constants.FORM_TYPE_POLICY) {
      setFormData(emptyPolicyData());
    } else if (formType === constants.FORM_TYPE_RESIDENCE) {
      setFormData(emptyResidenceData());
    } else if (formType === constants.FORM_TYPE_USER) {
      setFormData(emptyUserData());
    }

  }, [formType]);
  
  /* Whenever a selectedAddr, selectedAnnouncement, selectedPolicy selectedUser, or selectedResidence changes, 
    clear the existing form data first before loading the new data. */
  useEffect(() => {
    if (parentState?.selectedAddrData) {
      setFormData(emptyAddrData());
    } else if (parentState?.selectedAnnouncementData) {
      setFormData(emptyAnnouncementData());
    } else if (parentState?.selectedPolicyData) {
      setFormData(emptyPolicyData());
    } else if (parentState?.selectedUserData) {
      setFormData(emptyUserData());
    } else if (parentState?.selectedResidenceData) {
      setFormData(emptyResidenceData());
    }
  }, [
    parentState?.selectedAddrData,
    parentState?.selectedPolicyData,
    parentState?.selectedUserData,
    parentState?.selectedResidenceData,
    parentState?.selectedAnnouncementData
  ]);

  /* Ensures existing addrData/announcementData/policyData/userData/residenceData are only loaded only AFTER emptyAddrData()
     (or emptyUserData(), etc.) is completed. */
  useEffect(() => {
    if ((formMode === constants.MODE_ADDRESS_UPDATE_DELETE || formMode === constants.MODE_ADDRESS_UPDATE) && addrDataIsEmpty(formData)) {
      loadAddressDataToForm();
    }

    if ((formMode === constants.MODE_ANNOUNCEMENT_UPDATE_DELETE) && announcementDataIsEmpty(formData)) {
      loadAnnouncementDataToForm();
    }

    if ((formMode === constants.MODE_POLICY_UPDATE_DELETE) && policyDataIsEmpty(formData)) {
      loadPolicyDataToForm();
    }

    if ((formMode === constants.MODE_USER_UPDATE_DELETE || formMode === constants.MODE_USER_PROFILE) && userDataIsEmpty(formData)) {
      loadUserDataToForm();
    }

    if (formMode === constants.MODE_RESIDENCE_UPDATE_DELETE && residenceDataIsEmpty(formData)) {
      loadResidenceDataToForm();
    }
  }, [formData]);

  /* Updates formData.owners every time a user is clicked
     and parentState.selectedOwnerInUsersDisplay is updated. */
  useEffect(() => {
    if ( parentState?.selectedOwnerInUsersDisplay ) {
      const tempFormData = { ...formData };
      
      if (tempFormData?.owners && (!userArrayHasUserID(tempFormData.owners, parentState.selectedOwnerInUsersDisplay.id))) {
        tempFormData.owners.unshift({...parentState.selectedOwnerInUsersDisplay});
        setFormData(tempFormData);

        /* Notify child OwnerInput (as required) that formData.owners changed */
        //setFormDataOwnersChanged(!formDataOwnersChanged);
      } else if (formData?.owners === null) {
        tempFormData.owners = [{...parentState.selectedOwnerInUsersDisplay}];
        setFormData(tempFormData);

        /* Notify child OwnerInput (as required) that formData.owners changed */
        //setFormDataOwnersChanged(!formDataOwnersChanged);
      }
    }
  }, [parentState?.selectedOwnerInUsersDisplay]);

  /* Updates formData.residences every time a residence is clicked
     and parentState.selectedResidenceInResidencesDisplay is updated. */
  useEffect(() => {
    if ( parentState?.selectedResidenceInResidencesDisplay ) {
      const tempFormData = { ...formData };
      
      if (tempFormData?.residences && (indexOfObj(parentState.selectedResidenceInResidencesDisplay.id, tempFormData.residences) === -1)) {
        tempFormData.residences.unshift({...parentState.selectedResidenceInResidencesDisplay});
        setFormData(tempFormData);

        /* Notify child ResidenceInput (as required) that formData.residences changed */
        //setFormDataResidencesChanged(!formDataResidencesChanged);
      } else if (formData?.residences === null) {
        tempFormData.residences = [{...parentState.selectedResidenceInResidencesDisplay}];
        setFormData(tempFormData);

        /* Notify child ResidenceInput (as required) that formData.residences changed */
        //setFormDataResidencesChanged(!formDataResidencesChanged);
      }
    }
  }, [parentState?.selectedResidenceInResidencesDisplay]);


  //////////////
  /*  Render  */
  //////////////

  if (formType === constants.FORM_TYPE_USER && (formMode === constants.MODE_USER_ADD || formMode === constants.MODE_USER_UPDATE_DELETE) && formDataIsUser()) {
    return (
      <UserForm
        handleAddUserClicked={ handleAddUserClicked }
        handleAssignResidencesClicked={ parentHandlers.handleAssignResidencesClicked }
        handleClearImageClicked={ handleClearImageClicked }
        handleDoneAssigningResidencesClicked={ parentHandlers.handleDoneAssigningResidencesClicked }
        handleRemoveResidenceClicked={ handleRemoveResidenceClicked }
        handleUpdateUserClicked={ handleUpdateUserClicked }
        handleDeleteUserClicked={ handleDeleteUserClicked }
        handleSwitchModeToAddClicked={ parentHandlers.handleSwitchUserModeToAddClicked }
        handleAddMailingAddressClicked={ () =>
          {
            setFormData(null);
            parentHandlers.handleAddMailingAddressClicked();
          }
        }
        handleUpdateMailingAddressClicked={ () =>
          {
            setFormData(null);
            parentHandlers.handleUpdateMailingAddressClicked();
          }
        }
        mode={ formMode }
        onChange={ onUserFormChange }
        residenceInputMode={ parentState.residenceInputMode }
        selectedResidenceIDInResidenceSelect={ parentState.selectedResidenceIDInResidenceSelect }
        setSelectedResidenceIDInResidenceSelect={ parentState.setSelectedResidenceIDInResidenceSelect }
        userData={ formData }
        parentRefs={ parentRefs }
      />
    );
  } else if (formType === constants.FORM_TYPE_USER && formMode === constants.MODE_USER_SELF_REGISTER && formDataIsUser()) {
    return (
      <UserForm
        handleAddUserClicked={ handleAddUserClicked }
        handleClearImageClicked={ handleClearImageClicked }
        handleAddMailingAddressClicked={ () =>
          {
            setFormData(null);
            parentHandlers.handleAddMailingAddressClicked();
          }
        }
        mode={ formMode }
        onChange={ onUserFormChange }
        userData={ formData }
        parentRefs={ parentRefs }
      />
    );
  } else if (formType === constants.FORM_TYPE_USER && formMode === constants.MODE_USER_PROFILE && formDataIsUser()) {
    return (
      <UserForm
        handleUpdateUserClicked={ handleUpdateUserClicked }
        handleClearImageClicked={ handleClearImageClicked }
        handleAddMailingAddressClicked={ () =>
          {
            setFormData(null);
            parentHandlers.handleAddMailingAddressClicked();
          }
        }
        handleUpdateMailingAddressClicked={ () =>
          {
            setFormData(null);
            parentHandlers.handleUpdateMailingAddressClicked();
          }
        }
        mode={ formMode }
        onChange={ onUserFormChange }
        userData={ formData }
        parentRefs={ parentRefs }
      />
    );
  } else if (formType === constants.FORM_TYPE_ADDRESS && formDataIsAddress()) {
    if (formMode === constants.MODE_ADDRESS_ADD || formMode === constants.MODE_ADDRESS_UPDATE_DELETE) {
      return (
        <div>
          <AddressForm
            addrData={ formData }
            displayButtonAddInstead = { true }
            handleAddAddressClicked={ handleAddAddressClicked }
            handleClearImageClicked={ handleClearImageClicked }
            handleDeleteAddressClicked={ handleDeleteAddressClicked }
            handleUpdateAddressClicked={ handleUpdateAddressClicked }
            handleSwitchModeToAddClicked={ parentHandlers.handleSwitchAddressModeToAddClicked }
            label="Address"
            mode={ formMode }
            onChange={ onAddressFormChange }
          />
        </div>
      );
    }
  } else if (formType === constants.FORM_TYPE_ADDRESS_FOR_USER) {
    if (formMode === constants.MODE_PROMPT_ADD_MAILING_ADDRESS_TO_USER) { // No formData required
      return (
        <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground">
          <h1 className="mb-4 text-wrap colorsettings_bodyheaders">
            Do you want to add a mailing address?
          </h1>
          <div className={`d-flex mb-4 flex-wrap justify-content-center align-items-center`}>
            <div className={`${styles.button_container_size} d-flex flex-wrap justify-content-evenly`}>
              <Button
                className="colorsettings_buttonfilled"
                id="button-yes"
                variant="primary"
                type="button"
                onClick={ parentHandlers.handleAddMailingAddressClicked }>
                Yes
              </Button>
              <Button
                className="colorsettings_buttonoutline"
                id="button-skip"
                variant="outline-primary"
                type="button"
                onClick={ parentHandlers.handleSkipAddressClicked }>
                Skip
              </Button>
            </div>
          </div>
        </Form>
      );
    } else if (
      (
        formMode === constants.MODE_ADDRESS_ADD ||
        formMode === constants.MODE_ADDRESS_UPDATE_DELETE ||
        formMode === constants.MODE_ADDRESS_UPDATE
      ) && formDataIsAddress()
    ) {
      return (
        <div>
          <AddressForm
            addrData={ formData }
            displayButtonAddInstead = { false } // don't display if it's an address_for_user.  Adding standalone addresses isn't allowed if the address is being modified for a specific user.
            handleAddAddressClicked={ handleAddAddressClicked }
            handleClearImageClicked={ handleClearImageClicked }
            handleDeleteAddressClicked={ handleDeleteAddressClicked }
            handleSwitchModeToAddClicked={ null } // Adding standalone addresses isn't allowed if the address is being modified for a specific user.
            handleUpdateAddressClicked={ handleUpdateAddressClicked }
            label="Mailing Address"
            mode={ formMode }
            onChange={ onAddressFormChange }
          />
          <div className="d-flex mb-4 flex-wrap justify-content-center align-items-center">
            <div className="d-flex flex-wrap justify-content-center">
              <Button
                className="ms-5 me-5 colorsettings_buttonoutline"
                variant="outline-primary"
                type="button"
                onClick={ parentHandlers.handleCancelAddressClicked }>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

  } else if (formType === constants.FORM_TYPE_ANNOUNCEMENT && formDataIsAnnouncement()) {
    if (formMode === constants.MODE_ANNOUNCEMENT_ADD || formMode === constants.MODE_ANNOUNCEMENT_UPDATE_DELETE) {
      return (
        <div>
          <AnnouncementForm
            formData={ formData }
            bootstrapSettings={''}
            displayButtonAddInstead = { true }
            handleAddAnnouncementClicked={ handleAddAnnouncementClicked }
            handleClearImageClicked={ handleClearImageClicked }
            handleDeleteAnnouncementClicked={ handleDeleteAnnouncementClicked }
            handleSwitchModeToAddClicked={ parentHandlers.handleSwitchAnnouncementModeToAddClicked }
            handleUpdateAnnouncementClicked={ handleUpdateAnnouncementClicked }
            label="Announcement"
            mode={ formMode }
            onChange={ onAnnouncementFormChange }
          />
        </div>
      );
    }
  } else if (formType === constants.FORM_TYPE_POLICY && formDataIsPolicy()) {
    if (formMode === constants.MODE_POLICY_ADD || formMode === constants.MODE_POLICY_UPDATE_DELETE) {
      return (
        <div>
          <PolicyForm
            bootstrapSettings={'mb-1'}
            displayButtonAddInstead = { true }
            formData={ formData }
            handleAddOptionClicked = { handleAddOptionClicked }
            handleAddPolicyClicked={ handleAddPolicyClicked }
            handleClearImageClicked={ handleClearImageClicked }
            handleDeletePolicyClicked={ handleDeletePolicyClicked }
            handleRemoveOptionClicked={ handleRemoveOptionClicked }
            handleSwitchModeToAddClicked={ parentHandlers.handleSwitchModeToAddClicked }
            handleUpdatePolicyClicked={ handleUpdatePolicyClicked }
            label="Policy"
            mode={ formMode }
            onChange={ onPolicyFormChange }
            selectedOptionInOptionSelect={ parentState.selectedOptionInOptionSelect }
            setSelectedOptionInOptionSelect={ parentState.setSelectedOptionInOptionSelect }
          />
        </div>
      );
    }
  } else if (formType === constants.FORM_TYPE_RESIDENCE && formDataIsResidence()) {
    return (
      <div>
        <ResidenceForm
          formData={ formData }
          //formDataOwnersChanged={ formDataOwnersChanged }
          bootstrapSettings="mb-3" // Creates vertical space for additional fields
          displayButtonAddInstead = { true }
          handleAddResidenceClicked={ handleAddResidenceClicked }
          handleAssignOwnersClicked={ parentHandlers.handleAssignOwnersClicked }
          handleClearImageClicked={ handleClearImageClicked }
          handleDeleteResidenceClicked={ handleDeleteResidenceClicked }
          handleDoneAssigningOwnersClicked={ parentHandlers.handleDoneAssigningOwnersClicked }
          handleRemoveOwnerClicked={ handleRemoveOwnerClicked }
          handleSwitchModeToAddClicked={ parentHandlers.handleSwitchResidenceModeToAddClicked }
          handleUpdateResidenceClicked={ handleUpdateResidenceClicked }
          mode={ formMode }
          onChange={ onResidenceFormChange }
          ownerInputMode={ parentState.ownerInputMode }
          selectedOwnerIDInOwnerSelect={ parentState.selectedOwnerIDInOwnerSelect }
          setSelectedOwnerIDInOwnerSelect={ parentState.setSelectedOwnerIDInOwnerSelect }
        />
      </div>
    );
  } else if (formType === constants.FORM_TYPE_RESIDENCES_FOR_USER) {
    if (formMode === constants.MODE_PROMPT_ADD_RESIDENCES_TO_USER) { // No formData required
      return (
        <h1>Placeholder for Prompting - Residences For User Form</h1>
      );
    } else if (formDataIsResidences()) {
      return (
        <h1>Placeholder for Residences For User Form (with form data)</h1>
      );
    }

  }
}
export default FormManager;
