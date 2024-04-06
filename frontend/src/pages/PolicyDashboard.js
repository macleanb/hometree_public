/* External Libraries */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import addPolicyChoice from '../utils/policy/addPolicyChoice';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import convertArrayToDict from '../utils/convertArrayToDict';
import emptyPolicyData from '../utils/policy/emptyPolicyData';
import ErrorDisplay from '../components/ErrorDisplay';
import frequencyCounter from '../utils/frequencyCounter';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import { getAllAddressesAsDict } from '../utils/addressUtils';
import getAllPoliciesAsArray from '../utils/policy/getAllPoliciesAsArray';
import { getAllResidencesAsArray } from '../utils/residenceUtils';
import getPolicyByID from '../utils/policy/getPolicyByID';
import getPolicyOptions from '../utils/policy/getPolicyOptions';
import getResidencePolicyChoices from '../utils/policy/getResidencePolicyChoices';
import getResidencesForUser  from '../utils/residence/getResidencesForUser';
import indexOfObj from '../utils/indexOfObj';
import NavContainer from '../components/NavContainer';
import PoliciesDisplay from '../components/PoliciesDisplay';
import ResidencePolicyChoices from '../components/ResidencePolicyChoices';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';
import updatePolicyChoice from '../utils/policy/updatePolicyChoice';

/* This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
   PoliciesDisplay, and a ResidencePolicyChoices pane that lists policy
   choices by residence address (if they are intended to be public).  */
const PolicyDashboard = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ allPoliciesDataArr, setAllPoliciesDataArr ] = useState();
  const [ allResidencesDataArr, setAllResidencesDataArr ] = useState();
  const [ allResidencesDataDict, setAllResidencesDataDict ] = useState();
  const [ currentCommunityPolicy, setCurrentCommunityPolicy ] = useState();
  const [ options, setOptions ] = useState();
  const [ residencesForUserArr, setResidencesForUserArr ] = useState();
  const [ residencesForUserDict, setResidencesForUserDict ] = useState();
  const [ residencePolicyChoicesDataArr, setResidencePolicyChoicesDataArr ] = useState();
  const [ selectedPolicyData, setSelectedPolicyData ] = useState();
  const [ selectedPolicyOptions, setSelectedPolicyOptions ] = useState({});
  const [ policyChoicePublicVisibilities, setPolicyChoicePublicVisibilities ] = useState({});

  /* Other Declarations */
  const navigate = useNavigate();

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Loads a given policy's options from the backend */
  const loadPolicyOptionsFromBackend = async (policyID) => {
    const apiResponse = await getPolicyOptions(policyID, setBackEndErrors);

    if (Array.isArray(apiResponse)) {
      /* Update options state */
      setOptions(apiResponse);
    }
  }

  /* Loads user's residences from backend and sets residencesForUser */
  const loadUsersResidencesFromBackend = async () => {
    const apiResponse = await getResidencesForUser(auth, setBackEndErrors);

    if (Array.isArray(apiResponse) && !backEndErrors) {
      const residences = apiResponse;
      /* Update residencesForUser state */
      setResidencesForUserArr(residences);
    }
  }

  /* Loads policy data from backend and sets selectedPolicyData */
  const loadSinglePolicyFromBackend = async (policyID) => {
    const apiResponse = await getPolicyByID(auth, policyID, setBackEndErrors);

    if (apiResponse && apiResponse.id) {
      const policyData = apiResponse;

      /* Update PoliciesDisplay with current data */
      updateSinglePolicyInPolicyDataArray(policyData);

      /* Update selectedPolicyData state */
      setSelectedPolicyData(policyData);
    } else {
      setSelectedPolicyData(emptyPolicyData());
    }
  }

  /* Loads residencePolicyChoicesData from backend. Also updates
     currentCommunityPolicy state for the selected policy */
  const loadResidencePolicyChoicesDataFromBackend = async (policyID) => {
    const rawResidencePolicyChoices = await getResidencePolicyChoices(policyID, setBackEndErrors);

    /* Ensure dependencies are all valid before proceeding */
    if (
      Array.isArray(rawResidencePolicyChoices) &&
      Array.isArray(options) &&
      Array.isArray(residencesForUserArr) &&
      residencesForUserDict && 
      allResidencesDataDict
      )
    {
      const usersResidencePolicyChoices = [];
      const residencesWithPolicyChoices = new Set();
      const publicResidencePolicyChoices = [];
      const anonymousResidencePolicyChoices = [];
      let residencePolicyChoicesArr = [];

      /* Gather policy choices owned by the user. Insert an options array to each. */
      for (const residencePolicyChoice of rawResidencePolicyChoices) {
        if (residencePolicyChoice.fk_Residence?.id in residencesForUserDict) {
          const residenceID = residencePolicyChoice.fk_Residence.id;

          residencePolicyChoice['options'] = options;

          /* Update selectedPolicyOptions state with the current residence ID and selected option ID */
          const selectedOptionID = residencePolicyChoice.fk_PolicyOption.id;
          const makePublicSelection = residencePolicyChoice.make_public;
          selectedPolicyOptions[residenceID] = selectedOptionID;
          policyChoicePublicVisibilities[residenceID] = makePublicSelection;

          usersResidencePolicyChoices.push(residencePolicyChoice);
          residencesWithPolicyChoices.add(residenceID);
        }
      }
      setSelectedPolicyOptions(selectedPolicyOptions);

      /* For any user's residence that doesn't have a corresponding policy choice,
         create an options array that includes a blank option (key '-1') */
      for (const usersResidence of residencesForUserArr) {
        const residenceID = usersResidence.id;

        /* Only continue if this residences doesn't already have a policy choice */
        if (!residencesWithPolicyChoices.has(residenceID)) {
          const emptyPolicyOption = {
            id: -1,
            option_text: 'No option selected',
            fk_Policy: policyID
          }
  
          /* Get the residence object with address, updating fk_Address to 
             include street data */
          const residenceData = allResidencesDataDict[residenceID];
          const street = residenceData?.street;
          residenceData['fk_Address'] = {
            id: residenceData['fk_Address'],
            street: street
          }
  
          const emptyPolicyChoice = {
            id: -1,
            fk_Residence: residenceData,
            fk_Policy: policyID,
            fk_PolicyOption: emptyPolicyOption, // meaning no choice has been made
            make_public: true 
          }
  
          /* Create expanded options to hold additional emptyPolicyOption since
              no policy option is currently chosen by the user */
          const expandedOptions = [...options];
          expandedOptions.unshift(emptyPolicyOption);
          emptyPolicyChoice['options'] = expandedOptions;

          usersResidencePolicyChoices.push(emptyPolicyChoice);
        }
      }

      /* Gather policy choices publicly attributed to residences (which
         don't belong to user) */
      for (const residencePolicyChoice of rawResidencePolicyChoices) {
        if (residencePolicyChoice.fk_Residence.id !== -1 && !(residencePolicyChoice.fk_Residence.id in residencesForUserDict)) {
          publicResidencePolicyChoices.push(residencePolicyChoice);
          residencesWithPolicyChoices.add(residencePolicyChoice.fk_Residence.id);
        }
      }

      /* Gather anonymous policy choices */
      for (const residencePolicyChoice of rawResidencePolicyChoices) {
        if (residencePolicyChoice.fk_Residence.id === -1) {
          anonymousResidencePolicyChoices.push(residencePolicyChoice);
        }
      }

      residencePolicyChoicesArr = usersResidencePolicyChoices;
      residencePolicyChoicesArr = residencePolicyChoicesArr.concat(publicResidencePolicyChoices);
      residencePolicyChoicesArr = residencePolicyChoicesArr.concat(anonymousResidencePolicyChoices);

      /* Update residencePolicyChoicesDataArr state */
      setResidencePolicyChoicesDataArr(residencePolicyChoicesArr);

      // /* Count the frequencies of each policy choice and update 
      //    currentCommunityPolicy state */
      // const residencePolicyChoiceFreqs = frequencyCounter(residencePolicyChoicesArr, 'fk_PolicyOption', 'id', [-1]);
      // if (residencePolicyChoiceFreqs?._totalCount > 0) {
      //   let mostFrequentPolicyOption = { option_text: 'votes are tied: no current policy' }
      //   const maxFrequency = residencePolicyChoiceFreqs['_maxFreq'];
      //   const totalCount = rawResidencePolicyChoices.length;
      //   const percentage = (maxFrequency / totalCount)*100;

      //   if (residencePolicyChoiceFreqs._maxKeyArr.length === 1) { // votes are NOT tied
      //     const mostFrequentPolicyChoice = residencePolicyChoiceFreqs['_maxKeyArr'][0]; // the single most popular PolicyOption id
      //     const mostFrequentPolicyOptionIndex = indexOfObj(mostFrequentPolicyChoice, options);

      //     if (mostFrequentPolicyOptionIndex >= 0) {
      //       mostFrequentPolicyOption = options[mostFrequentPolicyOptionIndex];
      //     }
      //   }

      //   setCurrentCommunityPolicy({ policyOption: mostFrequentPolicyOption, percentage: percentage.toFixed(0)})
      // }
    }  else {
      setResidencePolicyChoicesDataArr(null);
    }
  }

  /* Gets policy data asynchronously from API and sets the result to local state  */
  const setAllPoliciesDataAsArray = async () => {
      const data = await getAllPoliciesAsArray(auth);
      setAllPoliciesDataArr(data);
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
    using the state setter function as the only argument  */
  const setAllResidencesDataAsArray = async () => {
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
    
    setAllResidencesDataArr(residencesArr);
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
    using the state setter function as the only argument  */
  const setAllResidenceDataAsDict = async (residenceDataArr) => {
    const resDataDict = convertArrayToDict(residenceDataArr, 'id');
    setAllResidencesDataDict(resDataDict);
  }

  /* Sets residencesForUser as a dict  */
  const setResidencesForUserAsDict = async (residencesForUserArr) => {
    const resForUserDataDict = convertArrayToDict(residencesForUserArr, 'id');
    
    setResidencesForUserDict(resForUserDataDict);
  }

  /* Updates the displayed current community policy */
  const updateCurrentCommunityPolicy = async () => {
    if (selectedPolicyData?.id && residencePolicyChoicesDataArr && options) {
      const rawResidencePolicyChoices = await getResidencePolicyChoices(selectedPolicyData.id, setBackEndErrors);

      /* Count the frequencies of each policy choice and update 
         currentCommunityPolicy state */
      const residencePolicyChoiceFreqs = frequencyCounter(residencePolicyChoicesDataArr, 'fk_PolicyOption', 'id', [-1]);
      if (residencePolicyChoiceFreqs?._totalCount >= 0) {
        let mostFrequentPolicyOption = { option_text: 'N/A - votes are tied or non-existent' }
        const maxFrequency = residencePolicyChoiceFreqs['_maxFreq'];
        const totalCount = rawResidencePolicyChoices.length;
        const percentage = totalCount > 0 ? (maxFrequency / totalCount)*100 : 0;
  
        if (residencePolicyChoiceFreqs._maxKeyArr.length === 1) { // votes are NOT tied
          const mostFrequentPolicyChoice = residencePolicyChoiceFreqs['_maxKeyArr'][0]; // the single most popular PolicyOption id
          const mostFrequentPolicyOptionIndex = indexOfObj(mostFrequentPolicyChoice, options);
  
          if (mostFrequentPolicyOptionIndex >= 0) {
            mostFrequentPolicyOption = options[mostFrequentPolicyOptionIndex];
          }
        }
  
        setCurrentCommunityPolicy({ policyOption: mostFrequentPolicyOption, percentage: percentage.toFixed(0)})
      }
    }
  }

  /* Updates a single policy in the AllPoliciesData array with new information  */
  const updateSinglePolicyInPolicyDataArray = async (updatedPolicy) => {
    if (updatedPolicy.id && allPoliciesDataArr) {
      /* Get the index of the existing policy */
      const oldPolicyIndex = indexOfObj(
        updatedPolicy.id,
        allPoliciesDataArr
      );

      if (oldPolicyIndex >= 0) {
        /* Copy allPoliciesData to a temp variable before updating */
        const tempAllPoliciesDataArr = [...allPoliciesDataArr];

        /* Replace the old policy with a copy of the new policy */
        tempAllPoliciesDataArr[oldPolicyIndex] = {...updatedPolicy};
        setAllPoliciesDataArr(tempAllPoliciesDataArr);
      }
    }
  }

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }

  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  const handleMakePublicCheckboxChanged = (residenceID) => {
    const tempPolicyChoicePublicVisibilities = {...policyChoicePublicVisibilities};
    tempPolicyChoicePublicVisibilities[residenceID] = residenceID in policyChoicePublicVisibilities ? !policyChoicePublicVisibilities[residenceID] : true;
    setPolicyChoicePublicVisibilities(tempPolicyChoicePublicVisibilities);
  }

  const handlePolicyClicked = async (policyDict) => {
    clearErrorStates();

    if (policyDict?.id) {
      /* Load the current policy data from the backend */
      loadSinglePolicyFromBackend(policyDict.id);
      setSelectedPolicyOptions({});
      setPolicyChoicePublicVisibilities({});
    }
  }

  const handleUpdatePolicyChoiceClicked = async (residenceID, residencePolicyChoiceID) => {
    /* First make sure that a valid policy option is selected */
    if (!(residenceID in selectedPolicyOptions) || selectedPolicyOptions[residenceID] === -1) {
      setFrontEndErrors({Error: 'Could not update policy choice because no valid policy option was selected.'});
      return null;
    }

    /* Make sure a valid policy ID is selected */
    if (!selectedPolicyData?.id) {
      setFrontEndErrors({Error: 'Could not update policy choice because no valid policy was selected.'});
      return null;
    }

    /* Make sure the user owns the residence they are trying to 
       choose policies for */
    const usersResidences = await getResidencesForUser(auth, setBackEndErrors);
    const indexOfUsersResidence = indexOfObj(residenceID, usersResidences);
    if (indexOfUsersResidence === -1) {
      setFrontEndErrors({Error: `Could not update policy choice because you do not own residence ID ${residenceID}.`});
      return null;
    }

    const makeAddressPublic = residenceID in policyChoicePublicVisibilities ? policyChoicePublicVisibilities[residenceID] : false;

    let apiResponse;
    if (residencePolicyChoiceID === -1) {
      /* No policy choice exists.  Don't delete any existing policy
          choice from the backend; just create a new one */
      apiResponse = await addPolicyChoice(
        makeAddressPublic,
        selectedPolicyOptions[residenceID],
        selectedPolicyData.id,
        residenceID,
        setFrontEndErrors,
        setBackEndErrors
      )
    } else {
      /* A policy choice for this policy/residence already exists.  Update the
         make_public and fk_PolicyOption fields only. */
         apiResponse = await updatePolicyChoice(
          residencePolicyChoiceID,
          makeAddressPublic,
          selectedPolicyOptions[residenceID],
          selectedPolicyData.id,
          setFrontEndErrors,
          setBackEndErrors
        )
    }

    if (apiResponse?.id) {
      setSuccessMessages({Success: 'Policy choice updated.'});

      if (selectedPolicyData?.id) {
        loadResidencePolicyChoicesDataFromBackend(selectedPolicyData.id);
      }
    }
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
      setAllPoliciesDataAsArray();
      setAllResidencesDataAsArray();
      loadUsersResidencesFromBackend();
    }
  }
  }, [auth, navigate, setBackEndErrors]);

  /* Once policiesDataArr and residenceDataArr are populated, set the first record to selectedPolicyData,
     as long as selectedPolicyData is null or undefined. Also setResidenceDataDict */
  useEffect(() => {
    if (
      allPoliciesDataArr &&
      allPoliciesDataArr.length > 0 &&
      allResidencesDataArr?.length > 0 &&
      !selectedPolicyData
      )
    {  
      setSelectedPolicyData(allPoliciesDataArr[0]);
      setAllResidenceDataAsDict(allResidencesDataArr);
    }
  }, [allPoliciesDataArr, allResidencesDataArr, selectedPolicyData]);

  /* Whenever selectedPolicyData changed, retrieve the associated
     policy options from the backend */
  useEffect(() => {
    if (selectedPolicyData) {
      loadPolicyOptionsFromBackend(selectedPolicyData.id);
    }
  }, [selectedPolicyData]);

  /* When selectedPolicyData changes, populate the residencePolicyChoicesDataArr. */
  useEffect(() => {
    if (
      allResidencesDataDict &&
      options &&
      selectedPolicyData &&
      typeof residencesForUserDict !== 'undefined' &&
      residencesForUserDict !== null
      )
    {
      loadResidencePolicyChoicesDataFromBackend(selectedPolicyData.id);
    }
  }, [allResidencesDataDict, options, selectedPolicyData, residencesForUserDict]);

  /* Once residencesForUserArr is populated, populate the residencesForUserDict. */
  useEffect(() => {
    if (residencesForUserArr?.length >= 0) {
      setResidencesForUserAsDict(residencesForUserArr);
    }
  }, [residencesForUserArr]);

  /* Whenever residencePolicyChoicesDataArr is updated, update the 
     community policy that is displayed */
  useEffect(() => {
    if (residencePolicyChoicesDataArr?.length > 0) {
      updateCurrentCommunityPolicy();
    }
  }, [residencePolicyChoicesDataArr]);

  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div className="colorsettings_bodybackground">
        <NavContainer />
        <ErrorDisplay className="colorsettings_bodybackground"/>
        <SuccessDisplay />
        <div className="d-flex flex-wrap justify-content-start policydashboardcontainer">
          <PoliciesDisplay
            policiesDataArr={ allPoliciesDataArr }
            handlePolicyClicked={ handlePolicyClicked }
            setFrontEndErrors={ setFrontEndErrors }
            setBackEndErrors={ setBackEndErrors }
            setSuccessMessages={ setSuccessMessages }
          />
          <div className="d-flex me-5 flex-column flex-fill residencepolicychoicescontainer">
            <ResidencePolicyChoices
              currentCommunityPolicy={ currentCommunityPolicy }
              handleMakePublicCheckboxChanged={ handleMakePublicCheckboxChanged }
              handleUpdatePolicyChoiceClicked={ handleUpdatePolicyChoiceClicked }
              policyChoicePublicVisibilities={ policyChoicePublicVisibilities }
              residencePolicyChoicesDataArr={ residencePolicyChoicesDataArr }
              selectedPolicyData={ selectedPolicyData }
              selectedPolicyOptions={ selectedPolicyOptions }
              setPolicyChoicePublicVisibilities={ setPolicyChoicePublicVisibilities }
              setSelectedPolicyOptions={ setSelectedPolicyOptions }
              setFrontEndErrors={ setFrontEndErrors }
              setBackEndErrors={ setBackEndErrors }
              setSuccessMessages={ setSuccessMessages }
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

export default PolicyDashboard;