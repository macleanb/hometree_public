/* External Imports */
import { useContext, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { getClient, getCSRFToken } from '../utils/apiUtils';
import getURL_Map from '../utils/getURL_Map';

const MapDisplayStatic = ({parentState}) => {

  ///////////////////////
  /*   Declarations    */
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);

  /* Ref Declarations */
  const iconVisibilityRef = useRef({});

  /* State Declarations */
  const [ backendHTML, setBackendHTML ] = useState();


  /////////////////
  /* Use Effects */
  /////////////////

  useEffect(() => {
    if (parentState?.residenceLatLongs && parentState.residenceLatLongs.length > 0){
      for (const residence of parentState.residenceLatLongs) {
        if(residence.lat !== null && residence.lng !== null) {
          const latLngKey = residence.lat.toString() + residence.lng.toString();
          iconVisibilityRef.current[latLngKey] = false;
        }
      }
    }
  }, [parentState?.residenceLatLongs]);

  /* Get HTML sent as text from backend */
  useEffect(() => {
    /* Create 'active' variable for clean-up up purposes */
    let active = true;

    if (parentState?.residenceLatLongs && parentState.residenceLatLongs.length > 0){
      /* Get html from backend server */
      const getHTML = async () => {
        const client = getClient();
        const csrfToken = getCSRFToken();

        /* Get data from API then set to backendHTML state */
        const response = await client.post(
          getURL_Map(),
          {
            center_lat         : constants.MAP_CENTERPOINT.lat,
            center_lng         : constants.MAP_CENTERPOINT.lng,
            residence_lat_lngs : parentState.residenceLatLongs,
            zoom_level : 17
          },
          {
            headers: { 
              'Content-Type': 'application/json',
              "X-CSRFToken": csrfToken
            },
            withCredentials: true
          }
        );

        if (response.status === 200 && active) {
          setBackendHTML(response.data.html);
        }
      }
      
      getHTML();
    }

    /* Clean up */
    return () => {
      active = false;
    }
  }, [parentState?.residenceLatLongs]);


  ////////////
  /* Render */
  ////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div id="map-display-static" style={{maxWidth: '40vw', height: 'auto'}}>
      {
        parentState.residenceLatLongs && parentState.residenceLatLongs.length > 0 && backendHTML
        ?
          <>
            <h1 className="mb-4 colorsettings_bodybackground colorsettings_bodyheaders"><u>Community Map</u></h1>
            <div
              // dangerouslySetInnerHTML={{ __html: backendHTML }} // less safe
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(backendHTML) }}
              style={{maxWidth: '100%', height: 'auto', border: '5px solid #427b01'}}
            >
            </div>
          </>
        : <h1 className="mt-4">Loading map...</h1>
      }
      </div>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
};

export default MapDisplayStatic;