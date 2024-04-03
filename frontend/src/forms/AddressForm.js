////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import AddressInputs from '../components/AddressInputs';
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import CRUDButtons from '../components/CRUDButtons';
import ImageInput from '../components/ImageInput';
import { userIsAuthorized } from '../utils/authUtils';


/* This form is for CRUD operations on Address objects */
const AddressForm = (
  { 
    addrData,
    bootstrapSettings,
    displayButtonAddInstead,
    handleAddAddressClicked,
    handleClearImageClicked,
    handleDeleteAddressClicked,
    handleSwitchModeToAddClicked,
    handleUpdateAddressClicked,
    label, // Allows basic address and mailing address
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
      <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground addressform" id="address-form">
          <h1 className={ `colorsettings_bodyheaders ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`}><u>{mode === constants.MODE_ADDRESS_ADD ? `New ${ label } Information` : mode === constants.MODE_ADDRESS_UPDATE ? `Update ${ label }` : `Update or Delete ${ label }`}</u></h1>
        <AddressInputs
          addrData={ addrData }
          onChange={ onChange }
          bootstrapSettings={ bootstrapSettings }
        />
        <ImageInput
          formData={ addrData }
          backendImageExists={ addrData?.backendImageExists ? addrData.backendImageExists : false}
          bootstrapSettings={ bootstrapSettings }
          handleClearImageClicked={ handleClearImageClicked }
          updateDeleteMode={ mode === constants.MODE_ADDRESS_UPDATE_DELETE }
          onChange={ onChange }
        />
        <CRUDButtons
          displayAddButton={ mode === constants.MODE_ADDRESS_ADD }
          displayButtonAddInstead={ displayButtonAddInstead }
          displayDeleteButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ADDRESS || constants.PERMISSIONS_CAN_DELETE_ALL_ADDRESSES) }
          displayUpdateButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ADDRESS || constants.PERMISSIONS_CAN_UPDATE_ALL_ADDRESSES) }
          handleAddClicked={ handleAddAddressClicked }
          handleDeleteClicked={ handleDeleteAddressClicked }
          handleSwitchModeToAddClicked={ handleSwitchModeToAddClicked }
          handleUpdateClicked={ handleUpdateAddressClicked }
          buttonLabel={ label }
        />
      </Form>
  );
}

export default AddressForm;