/* Reference: https://www.youtube.com/watch?v=PfZ4oLftItk&t=206s */
"use client";

////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useContext, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
} from '@vis.gl/react-google-maps';



/* Internal Libraries */
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import CustomAdvancedMarker from './CustomAdvancedMarker';
import secrets from '../secrets';

const MapDisplay = ({parentState}) => {
  ///////////////////////
  /*   Declarations    */
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);

  /* Ref Declarations */
  const iconVisibilityRef = useRef({});


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


  ////////////
  /* Render */
  ////////////

  /* There seems to be a way to make fully interactive AdvancedMarkerElements, but not using vis.gl (yet).  I'd have to 
     use google's library directly instead, but it isn't designed for React:
     https://developers.google.com/maps/documentation/javascript/reference/advanced-markers
     https://stackoverflow.com/questions/76782661/how-to-use-google-map-with-advanced-markers-in-react
  */
  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    return (
      <div style={{height: '75vh', width: '40vw'}}>
      {
        parentState.residenceLatLongs && parentState.residenceLatLongs.length > 0
        ?
          <APIProvider apiKey={ secrets.mapsAPIKey }>
            <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Community Map</u></h1>
            <Map zoom={17} center={{lat: constants.MAP_CENTERPOINT.lat, lng: constants.MAP_CENTERPOINT.lng}} mapId={ constants.MAP_ID }>
              {
                parentState.residenceLatLongs.map((residence) => (
                  residence.lat !== null && residence.lng !== null
                  ?
                    <CustomAdvancedMarker
                      key={ residence.lat.toString() + residence.lng.toString() }
                      position={ { lat: residence.lat, lng: residence.lng} }
                    />
                  : ''
                ))
              }
            </Map>
          </APIProvider>
        : ''
      }
      </div>
    );
  } else {
    return (
      <div>Loading page...</div>
    );
  }
};

export default MapDisplay;