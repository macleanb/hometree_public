/* External Imports */
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useContext, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { getClient, getCSRFToken } from '../utils/apiUtils';
import getURL_Map from '../utils/getURL_Map';
import styles from './MapOffCanvas.module.css';

const MapOffCanvas = ({parentState}) => {

  ///////////////////////
  /*   Declarations    */
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);

  /* Ref Declarations */
  const iconVisibilityRef = useRef({});

  /* State Declarations */
  const [ backendHTML, setBackendHTML ] = useState();
  const [ show, setShow ] = useState(false);
  

  //////////////////////////
  /*   Helper Functions   */
  //////////////////////////

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  ////////////////
  /*   Render   */
  ////////////////

  return (
    <>
      <Button
        className={styles.toggleable}
        onClick={handleShow}
        variant="light">
          view map
      </Button>

      <Offcanvas 
        className={`h-100`}
        show={ show }
        onHide={ handleClose }
        placement="top"
      >
        <Offcanvas.Header closeButton>
          {/* <Offcanvas.Title>Community Map</Offcanvas.Title> */}
        </Offcanvas.Header>
        <Offcanvas.Body>
          {
            auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED
            ?
              <div className={styles.map_container_size} id="map-display-static">
              {
                parentState.residenceLatLongs && parentState.residenceLatLongs.length > 0 && backendHTML
                ?
                  <>
                    <h1 className="mb-4 text-center colorsettings_bodybackground colorsettings_bodyheaders"><u>Community Map</u></h1>
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
            : <div>Loading page...</div>
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MapOffCanvas;