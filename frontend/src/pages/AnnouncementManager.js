/* External Libraries */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AnnouncementsDisplay from '../components/AnnouncementsDisplay';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import emptyAnnouncementData from '../utils/announcement/emptyAnnouncementData';
import ErrorDisplay from '../components/ErrorDisplay';
import FormManager from '../components/FormManager';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import getAllAnnouncementsAsArray from '../utils/announcement/getAllAnnouncementsAsArray';
import getAnnouncementByID from '../utils/announcement/getAnnouncementByID';
import getAnnouncementIdxFromAllAnnouncementDataArr from '../utils/announcement/getAnnouncementIdxFromAllAnnouncementDataArr';
import { getResponseError } from '../utils/errorUtils';
import NavContainer from '../components/NavContainer';
import SuccessContext from '../contexts/SuccessProvider';
import SuccessDisplay from '../components/SuccessDisplay';

/* This component renders a NavContainer, ErrorDisplay, SuccessDisplay, 
   AddressesDisplay, and generic FormContainer that allows CRUD operations
   for Addresses.  */
const AnnouncementManager = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ formData, setFormData ] = useState(emptyAnnouncementData()); // must be elevated here because in some object managers (ResidenceManager) ownerInputMode state (Users/ResidencesDisplay state) can change while filling out a single form
  const [ formType, setFormType ] = useState(constants.FORM_TYPE_ANNOUNCEMENT);
  const [ formMode, setFormMode ] = useState(constants.MODE_ANNOUNCEMENT_ADD);
  const [ selectedAnnouncementData, setSelectedAnnouncementData ] = useState(null);
  const [ allAnnouncementsData, setAllAnnouncementsData ] = useState({announcements: [],});

  /* Other Declarations */
  const navigate = useNavigate();


  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Gets announcement data from backend and sets selectedAnnouncementData */
  const getAnnouncementDataFromBackend = async (announcementID) => {
    getAnnouncementByID(auth, announcementID, setBackEndErrors).then( (apiResponse) => {
      if (apiResponse && !backEndErrors && apiResponse.id) {
        const announcementData = apiResponse;

        /* Update AnnouncementsDisplay with current data */
        updateSingleAnnouncementInAnnouncementDataArray(announcementData);

        /* Update selectedAnnouncementData state */
        setSelectedAnnouncementData(announcementData);
      } else {
        setSelectedAnnouncementData(emptyAnnouncementData());
      }
    }).catch((error) => {
      setBackEndErrors(getResponseError(error));
      setSelectedAnnouncementData(emptyAnnouncementData());
    });
  }

  /* Gets announcement data asynchronously from API and sets the result to local state  */
  const setAnnouncementsDataAsArray = async () => {
      const data = await getAllAnnouncementsAsArray(auth);
      setAllAnnouncementsData({announcements: data});
  }

  /* Updates a single announcement in the AllAnnouncementData array with new information  */
  const updateSingleAnnouncementInAnnouncementDataArray = async (updatedAnnouncement) => {
    if (updatedAnnouncement.id && allAnnouncementsData.announcements) {
      /* Get the index of the existing announcement */
      const oldAnnouncementIndex = getAnnouncementIdxFromAllAnnouncementDataArr(
        updatedAnnouncement.id,
        allAnnouncementsData.announcements
      );

      if (oldAnnouncementIndex) {
        /* Copy allAnnouncementData to a temp variable before updating */
        const tempAllAnnouncementData = {...allAnnouncementsData}

        /* Replace the old announcement with a copy of the new announcement */
        tempAllAnnouncementData.announcements[oldAnnouncementIndex] = {...updatedAnnouncement};
        setAllAnnouncementsData(tempAllAnnouncementData);
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

  const handleAnnouncementCreated = (announcementData) => {
    /* Refresh AnnouncementsDisplay */
    setAnnouncementsDataAsArray();

    /* Reset the form to ADD mode */
    setFormData(emptyAnnouncementData());
    setFormMode(constants.MODE_ANNOUNCEMENT_ADD);
    setSelectedAnnouncementData(null);
  }

  const handleAnnouncementUpdated = (newAnnouncementData) => {
    /* Refresh AnnouncementsDisplay */
    setAnnouncementsDataAsArray();

    /* Update selectedAnnouncementData state */
    setSelectedAnnouncementData(newAnnouncementData);
  }

  const handleAnnouncementDeleted = () => {
    /* Refresh AnnouncementsDisplay */
    setAnnouncementsDataAsArray();
      
    /* Reset formMode to ADD */
    setFormData(emptyAnnouncementData());
    setFormMode(constants.MODE_ANNOUNCEMENT_ADD);
    setSelectedAnnouncementData(null);
  }


  ///////////////////////////////////////////////
  /// Click and Button Press Event Processing ///
  ///////////////////////////////////////////////

  const handleAnnouncementClicked = async (announcementDict) => {
    clearErrorStates();

    if (announcementDict) {
      /* Get the current announcement data from the backend */
      getAnnouncementDataFromBackend(announcementDict.id).then(() => {
        setFormMode(constants.MODE_ANNOUNCEMENT_UPDATE_DELETE);
        setFormType(constants.FORM_TYPE_ANNOUNCEMENT);
      }).catch((error) => {
        setBackEndErrors(getResponseError(error)); 
      });
    }
  }

  /* This switches the announcement form mode back to 'ADD' if the user clicks the
     "Add Announcement Instead" button while in the 'UPDATE OR DELETE' mode. */
  const handleSwitchAnnouncementModeToAddClicked = (e) => {
    clearErrorStates();
    setFormData(emptyAnnouncementData());
    setFormMode(constants.MODE_ANNOUNCEMENT_ADD);
    setSelectedAnnouncementData(null);
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* Ensure the user is authenticated.  If so, load all announcements for 
      display.  If not, redirect to login. */
  useEffect(() => {
  if (auth && auth.status && navigate) {
    if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
      navigate('/login');
    } else {
      setAnnouncementsDataAsArray();
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
        <div className="d-flex flex-wrap justify-content-start announcementmanagercontainer">
          <AnnouncementsDisplay
            announcementsData={ allAnnouncementsData }
            handleAnnouncementClicked={ handleAnnouncementClicked }
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
                  handleAnnouncementCreated: handleAnnouncementCreated,
                  handleAnnouncementDeleted: handleAnnouncementDeleted,
                  handleAnnouncementUpdated: handleAnnouncementUpdated,
                  handleSwitchAnnouncementModeToAddClicked: handleSwitchAnnouncementModeToAddClicked,
                }
              }
              parentState={
                {
                  selectedAnnouncementData: selectedAnnouncementData
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

export default AnnouncementManager;