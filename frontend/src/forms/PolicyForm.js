/* External Imports */
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

/* Internal Imports */
import PolicyInputs from '../components/PolicyInputs';
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import CRUDButtons from '../components/CRUDButtons';
import ImageInput from '../components/ImageInput';
import PolicyOptionManager from '../components/PolicyOptionManager';
import { userIsAuthorized } from '../utils/authUtils';

/* This form is for CRUD operations on Policy objects */
const PolicyForm = (
  { 
    bootstrapSettings,
    displayButtonAddInstead,
    formData,
    handleAddOptionClicked,
    handleAddPolicyClicked,
    handleClearImageClicked,
    handleDeletePolicyClicked,
    handleRemoveOptionClicked,
    handleSwitchModeToAddClicked,
    handleUpdatePolicyClicked,
    label,
    mode,
    onChange,
    selectedOptionInOptionSelect,
    setSelectedOptionInOptionSelect
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
      <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground policyform" id="policy-form">
        <h1 className={ `colorsettings_bodyheaders ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`}><u>{mode === constants.MODE_POLICY_ADD ? `New ${ label }` : `Update or Delete ${ label }`}</u></h1>
        <PolicyInputs
          bootstrapSettings={ bootstrapSettings }
          formData={ formData }
          onChange={ onChange }
        />
        <PolicyOptionManager
          bootstrapSettings={ bootstrapSettings }
          formData={ formData }
          handleAddOptionClicked={ handleAddOptionClicked }
          handleRemoveOptionClicked={ handleRemoveOptionClicked }
          onChange={ onChange }
          selectedOptionInOptionSelect={ selectedOptionInOptionSelect }
          setSelectedOptionInOptionSelect={ setSelectedOptionInOptionSelect }
        />
        <ImageInput
          formData={ formData }
          backendImageExists={ formData?.backendImageExists ? formData.backendImageExists : false}
          bootstrapSettings={ bootstrapSettings }
          handleClearImageClicked={ handleClearImageClicked }
          updateDeleteMode={ mode === constants.MODE_POLICY_UPDATE_DELETE }
          onChange={ onChange }
        />
        <CRUDButtons
          displayAddButton={ mode === constants.MODE_POLICY_ADD }
          displayButtonAddInstead={ displayButtonAddInstead }
          displayDeleteButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_POLICY) }
          displayUpdateButton={ userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_POLICY) }
          handleAddClicked={ handleAddPolicyClicked }
          handleDeleteClicked={ handleDeletePolicyClicked }
          handleSwitchModeToAddClicked={ handleSwitchModeToAddClicked }
          handleUpdateClicked={ handleUpdatePolicyClicked }
          buttonLabel={ label }
        />
      </Form>
  );
}

export default PolicyForm;