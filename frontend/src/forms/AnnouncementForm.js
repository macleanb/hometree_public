////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import AnnouncementInputs from '../components/AnnouncementInputs';
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import CRUDButtons from '../components/CRUDButtons';
import ImageInput from '../components/ImageInput';
import { userIsAuthorized } from '../utils/authUtils';


/* This form is for CRUD operations on Announcement objects */
const AnnouncementForm = (
  { 
    bootstrapSettings,
    displayButtonAddInstead,
    formData,
    handleAddAnnouncementClicked,
    handleClearImageClicked,
    handleDeleteAnnouncementClicked,
    handleSwitchModeToAddClicked,
    handleUpdateAnnouncementClicked,
    label, // Allows custom titles
    mode,
    onChange,
  }) =>
{
  
  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  const { auth } = useContext(AuthContext);

  
  ////////////
  /* Render */
  ////////////

  return ( 
      <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground announcementform" id="announcement-form">
        <h1 className={ `colorsettings_bodyheaders ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`}><u>{mode === constants.MODE_ANNOUNCEMENT_ADD ? `New ${ label }` : `Update or Delete ${ label }`}</u></h1>
        <AnnouncementInputs
          formData={ formData }
          onChange={ onChange }
          bootstrapSettings={ bootstrapSettings }
        />
        <ImageInput
          formData={ formData }
          backendImageExists={ formData?.backendImageExists ? formData.backendImageExists : false}
          bootstrapSettings={ bootstrapSettings }
          handleClearImageClicked={ handleClearImageClicked }
          updateDeleteMode={ mode === constants.MODE_ANNOUNCEMENT_UPDATE_DELETE }
          onChange={ onChange }
        />
        <CRUDButtons
          displayAddButton={ mode === constants.MODE_ANNOUNCEMENT_ADD }
          displayButtonAddInstead={ displayButtonAddInstead }
          displayDeleteButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ANNOUNCEMENT) }
          displayUpdateButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ANNOUNCEMENT) }
          handleAddClicked={ handleAddAnnouncementClicked }
          handleDeleteClicked={ handleDeleteAnnouncementClicked }
          handleSwitchModeToAddClicked={ handleSwitchModeToAddClicked }
          handleUpdateClicked={ handleUpdateAnnouncementClicked }
          buttonLabel={ label }
        />
      </Form>
  );
}

export default AnnouncementForm;