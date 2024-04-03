/* This class is needed because Google AdvancedMarker
   component event handling is still (apparently) nascent */

import {
  AdvancedMarker,
  Marker,
  Pin,
} from '@vis.gl/react-google-maps';

import houseicon from '../house-door-fill.svg';

const CustomAdvancedMarker = ({
  position,
  mouseover,
  mouseout
}) => 
{
  /* vis.gl basic Marker component does handle mouse events but you can't easily display custom icons/content.
     vis.gl attributes to control mouseOver don't exist for AdvancedMarker yet. */
  return (
    // <Marker
    //   position={ position }
    //   visible={ true }
    //   onMouseOver = {event => console.log("Mouse entered marker!")}
    //   icon={ houseicon }
    // >
    // </Marker>

    <AdvancedMarker
      position={ position }
    >
      {/* <Pin
        background={"#427b01"}
        borderColor={"#427b01"}
        glyphColor={"white"}
      /> */}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill text-success" viewBox="0 0 16 16">
        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
      </svg>
    </AdvancedMarker>
  );
};

export default CustomAdvancedMarker;