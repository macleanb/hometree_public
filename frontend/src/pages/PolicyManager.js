/* External Libraries */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import PoliciesDisplay from '../components/PoliciesDisplay';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import emptyPolicyData from '../utils/policy/emptyPolicyData';
import ErrorDisplay from '../components/ErrorDisplay';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import getAllPoliciesAsArray from '../utils/policy/getAllPoliciesAsArray';
import getPolicyByID from '../utils/policy/getPolicyByID';
import indexOfObj from '../utils/indexOfObj';
import { getResponseError } from '../utils/errorUtils';
import NavContainer from '../components/NavContainer';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';

/* This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
   PoliciesDisplay, and generic FormContainer that allows CRUD operations
   for Policies.  */
const PolicyManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ policiesDataArr, setPoliciesDataArr ] = useState();
  const [ formData, setFormData ] = useState(emptyPolicyData());
  const [ formMode, setFormMode ] = useState(constants.MODE_POLICY_ADD);
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_POLICY);
  const [ selectedPolicyData, setSelectedPolicyData ] = useState(null);
  const [ selectedOptionInOptionSelect, setSelectedOptionInOptionSelect ] = useState(null);


  /* Other Declarations */
  const navigate = useNavigate();

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Gets policy data from backend and sets selectedPolicyData */
  const getPolicyDataFromBackend = async (policyID) => {
    getPolicyByID(auth, policyID, setBackEndErrors).then( (apiResponse) => {
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const policyData = apiResponse;

        /* Update PoliciesDisplay with current data */
        updateSinglePolicyInPolicyDataArray(policyData);

        /* Update selectedPolicyData state */
        setSelectedPolicyData(policyData);
      } else {
        setSelectedPolicyData(emptyPolicyData());
      }
    }).catch((error) => {
      setBackEndErrors(getResponseError(error));
      setSelectedPolicyData(emptyPolicyData());
    });
  }

  /* Gets policy data asynchronously from API and sets the result to local state  */
  const setPoliciesDataAsArray = async () => {
      const data = await getAllPoliciesAsArray(auth);
      setPoliciesDataArr(data);
  }

  /* Updates a single policy in the policiesDataArr with new information  */
  const updateSinglePolicyInPolicyDataArray = async (updatedPolicy) => {
    if (updatedPolicy.id && policiesDataArr) {
      /* Get the index of the existing policy */
      const oldPolicyIndex = indexOfObj(
        updatedPolicy.id,
        policiesDataArr
      );

      if (oldPolicyIndex >= 0) {
        /* Copy policiesDataArr to a temp variable before updating */
        const tempPoliciesDataArr = [...policiesDataArr]

        /* Replace the old policy with a copy of the new policy */
        tempPoliciesDataArr[oldPolicyIndex] = {...updatedPolicy};
        setPoliciesDataArr(tempPoliciesDataArr);
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

  const handlePolicyCreated = (policyData) => {
    /* Refresh PoliciesDisplay */
    setPoliciesDataAsArray();

    /* Reset the form to ADD mode */
    setFormData(emptyPolicyData());
    setFormMode(constants.MODE_POLICY_ADD);
    setSelectedPolicyData(null);
  }

  const handlePolicyUpdated = (newPolicyData) => {
    /* Refresh PoliciesDisplay */
    setPoliciesDataAsArray();

    /* Update selectedPolicyData state */
    setSelectedPolicyData(newPolicyData);
  }

  const handlePolicyDeleted = () => {
    /* Refresh PoliciesDisplay */
    setPoliciesDataAsArray();
      
    /* Reset formMode to ADD */
    setFormData(emptyPolicyData());
    setFormMode(constants.MODE_POLICY_ADD);
    setSelectedPolicyData(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  const handlePolicyClicked = async (policyDict) => {
    clearErrorStates();

    if (policyDict) {
      /* Get the current policy data from the backend */
      getPolicyDataFromBackend(policyDict.id).then(() => {
        setFormMode(constants.MODE_POLICY_UPDATE_DELETE);
        setFormType(constants.FORM_TYPE_POLICY);
      }).catch((error) => {
        setBackEndErrors(getResponseError(error)); 
      });
    }
  }

  /* This switches the policy form mode back to 'ADD' if the user clicks the
     "Add Policy Instead" button while in the 'UPDATE OR DELETE' mode. */
  const handleSwitchModeToAddClicked = (e) => {
    clearErrorStates();
    setFormData(emptyPolicyData());
    setFormMode(constants.MODE_POLICY_ADD);
    setSelectedPolicyData(null);
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* Ensure the user is authenticated.  If so, load all policies for 
      display.  If not, redirect to login. */
  useEffect(() => {
  if (auth && auth.status && navigate) {
    if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
      navigate('/login');
    } else {
      setPoliciesDataAsArray();
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
        <div className="d-flex flex-wrap justify-content-start policymanagercontainer">
          <PoliciesDisplay
            policiesDataArr={ policiesDataArr }
            handlePolicyClicked={ handlePolicyClicked }
            setFrontEndErrors={ setFrontEndErrors }
            setBackEndErrors={ setBackEndErrors }
            setSuccessMessages={ setSuccessMessages }
          />
          <div className="d-flex me-5 flex-column flex-fill formcontainer">
            <FormManager
              formData={ formData }
              formType={ formType }
              formMode={ formMode }
              parentHandlers={
                {
                  handlePolicyCreated: handlePolicyCreated,
                  handlePolicyDeleted: handlePolicyDeleted,
                  handlePolicyUpdated: handlePolicyUpdated,
                  handleSwitchModeToAddClicked: handleSwitchModeToAddClicked,
                }
              }
              parentState={
                {
                  selectedPolicyData: selectedPolicyData,
                  selectedOptionInOptionSelect : selectedOptionInOptionSelect,
                  setSelectedOptionInOptionSelect : setSelectedOptionInOptionSelect
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

export default PolicyManager;