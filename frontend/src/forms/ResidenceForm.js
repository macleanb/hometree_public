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
import DateInput from '../components/DateInput';
import ImageInput from '../components/ImageInput';
import OwnerInput from '../components/OwnerInput';
import { userIsAuthorized } from '../utils/authUtils';


/* This form is for CRUD operations on Residence objects */
const ResidenceForm = (
  { 
    bootstrapSettings,
    displayButtonAddInstead,
    formData,
    formDataOwnersChanged,
    handleAddResidenceClicked,
    handleAssignOwnersClicked,
    handleClearImageClicked,
    handleDeleteResidenceClicked,
    handleDoneAssigningOwnersClicked,
    handleRemoveOwnerClicked,
    handleSwitchModeToAddClicked,
    handleUpdateResidenceClicked,
    mode,
    onChange,
    ownerInputMode,
    selectedOwnerIDInOwnerSelect,
    setSelectedOwnerIDInOwnerSelect
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
      <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground residenceform" id="residence-form">
        <h1 className={ `colorsettings_bodyheaders ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`}><u>{mode === constants.MODE_RESIDENCE_ADD ? `New Residence Information` : `Update or Delete Residence`}</u></h1>
        <AddressInputs
          addrData={ formData }
          onChange={ onChange }
          bootstrapSettings={ bootstrapSettings }
        />
        <div className="d-flex flex-wrap justify-content-evenly">
          <ImageInput
            formData={ formData }
            backendImageExists={ formData?.backendImageExists ? formData.backendImageExists : false}
            bootstrapSettings={ bootstrapSettings }
            handleClearImageClicked={ handleClearImageClicked }
            updateDeleteMode={ mode === constants.MODE_RESIDENCE_UPDATE_DELETE }
            onChange={ onChange }
          />
          <DateInput
            bootstrapSettings={ bootstrapSettings }
            controlId={ constants.JOINED_DATE_FIELD_NAME }
            formData={ formData }
            label="HOA Member Since:"
            name="join_date"
            onChange={ onChange }
            required={ true }
          />
        </div>
        <OwnerInput
          bootstrapSettings={ bootstrapSettings }
          formData={ formData }
          //formDataOwnersChanged={ formDataOwnersChanged }
          handleAssignOwnersClicked={ handleAssignOwnersClicked }
          handleDoneAssigningOwnersClicked={ handleDoneAssigningOwnersClicked }
          handleRemoveOwnerClicked={ handleRemoveOwnerClicked }
          mode={ ownerInputMode }
          selectedOwnerIDInOwnerSelect={ selectedOwnerIDInOwnerSelect }
          setSelectedOwnerIDInOwnerSelect={ setSelectedOwnerIDInOwnerSelect }
        />
        <CRUDButtons
          displayAddButton={ mode === constants.MODE_RESIDENCE_ADD }
          displayButtonAddInstead={ displayButtonAddInstead }
          displayDeleteButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_ALL_RESIDENCES) }
          displayUpdateButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_ALL_RESIDENCES) }
          handleAddClicked={ handleAddResidenceClicked }
          handleDeleteClicked={ handleDeleteResidenceClicked }
          handleSwitchModeToAddClicked={ handleSwitchModeToAddClicked }
          handleUpdateClicked={ handleUpdateResidenceClicked }
          buttonLabel="Residence"
        />
      </Form>
  );
}

export default ResidenceForm;