/* External Libraries */
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AnnouncementsDisplay from '../components/AnnouncementsDisplay';
import '../App.css';
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import { getAllAddressesAsDict } from '../utils/addressUtils';
import getAllAnnouncementsAsArray from '../utils/announcement/getAllAnnouncementsAsArray';
import {
  getAllResidencesAsArray,
} from '../utils/residenceUtils';
import getResidenceLatLongs from '../utils/residence/getResidenceLatLongs';
import { getResponseError } from '../utils/errorUtils';
import ErrorDisplay from '../components/ErrorDisplay';
/* Uncomment to display responsive map (warning: provides API key to client browser!) */
/* import MapDisplay from '../components/MapDisplay'; */
import MapDisplayStatic from '../components/MapDisplayStatic';
import MapOffCanvas from '../components/MapOffCanvas';
import NavContainer from '../components/NavContainer';

const Home = () => {
  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);

  /* State Declarations */
  const [ allAnnouncementsData, setAllAnnouncementsData ] = useState({announcements: [],});
  const [ allResidenceDataArray, setAllResidenceDataArray ] = useState({residences: [],});
  const [ residenceLatLongs, setResidenceLatLongs ] = useState(null);

  /* Other Declarations */
  const navigate = useNavigate();

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Gets announcement data asynchronously from API and sets the result to local state  */
  const setAnnouncementsDataAsArray = async () => {
    const data = await getAllAnnouncementsAsArray(auth);
    setAllAnnouncementsData({announcements: data});
  }

  /* Gets residence data asynchronously from API and sets the result to local state,
     using the state setter function as the only argument  */
  const setResidenceDataAsArray = async () => {
    const residencesArr = await getAllResidencesAsArray(auth);
    const addrDict = await getAllAddressesAsDict(auth);

    /* For each residence in residencesArr, import the address fields
    directly into the residence element.  The fields will be referenced
    during render */
    if (residencesArr) {
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
  }

  /////////////////
  /* Use Effects */
  /////////////////

  /* Scroll to top of screen (for mobile) */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Ensure the user is logged in.  If so, load residence data. If not, redirect to login. */
  useEffect(() => {
    if (auth && auth.status && navigate) {
      if (auth.status === constants.STATUS_NOT_AUTHENTICATED) {
        navigate('/login');
      } else {
        setAnnouncementsDataAsArray();
        setResidenceDataAsArray();
      }
    }
  }, [auth, navigate]); // Re-run each time a dependency comes to life

  /* Once residenceData is loaded, load residence lat/longs. */
  useEffect(() => {
    if (allResidenceDataArray && Object.keys(allResidenceDataArray).length > 0 && setResidenceLatLongs) {
      getResidenceLatLongs(allResidenceDataArray.residences).then((result) => {
        const tempResidenceLatLongs = result;
        setResidenceLatLongs(tempResidenceLatLongs);
      }).catch((error) => {
        setBackEndErrors(getResponseError(error));
      });
    }
  }, [allResidenceDataArray, setResidenceLatLongs, setBackEndErrors]);

  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div>
          <NavContainer />
          <MapOffCanvas parentState={{ residenceLatLongs: residenceLatLongs }}/>
          <ErrorDisplay className="colorsettings_bodybackground"/>
          <br/>
          <div className="d-flex justify-content-around">
            {/* Uncomment for responsive map display (provides API key to client browser!) */}
            {/* <MapDisplay parentState={{ residenceLatLongs: residenceLatLongs }}/> */}
            <MapDisplayStatic parentState={{ residenceLatLongs: residenceLatLongs }}/>
            <AnnouncementsDisplay
              announcementsData={ allAnnouncementsData }
              handleAnnouncementClicked={ () => {} }
              setFrontEndErrors={ () => {}  }
              setBackEndErrors={ setBackEndErrors }
              setSuccessMessages={ () => {}  }
              size={ constants.SIZE_LARGE }
            />
          </div>
      </div>
    );
  } else {
    return (
      <h1>Loading page...</h1>
    );
  }
}

export default Home;
