/* This form doesn't submit anything on its own, but instead passes
   data outward to a parent controller, through state setter functions
   I also used code from these sites:
     https://dev.to/thomz/uploading-images-to-django-rest-framework-from-forms-in-react-3jhj
     https://stackoverflow.com/questions/72249811/how-to-upload-file-to-django-rest-framework-api-using-axios-and-react-hook-form
*/

import { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import { userIsAuthorized } from '../utils/authUtils';
import UserInputs from '../components/UserInputs';
import ResidenceInput from '../components/ResidenceInput';


////////////////
///  Render  ///
////////////////
    
const UserForm = (
  { 
    bootstrapSettings,
    handleClearImageClicked,
    handleAddUserClicked,
    handleAssignResidencesClicked,
    handleDoneAssigningResidencesClicked,
    handleRemoveResidenceClicked,
    handleUpdateUserClicked,
    handleDeleteUserClicked,
    handleSwitchModeToAddClicked,
    handleAddMailingAddressClicked,
    handleUpdateMailingAddressClicked,
    mode,
    onChange,
    parentRefs,
    userData,
    residenceInputMode,
    selectedResidenceIDInResidenceSelect,
    setSelectedResidenceIDInResidenceSelect,
  }
) => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  

  ////////////////
  ///  Render  ///
  ////////////////

  return (
    <Form className="d-flex mt-5 p-2 mb-5 flex-column colorsettings_bodybackground userform" id="user-form">
      <h1 className="colorsettings_bodyheaders mb-4"><u>{(mode === constants.MODE_USER_ADD || mode === constants.MODE_USER_SELF_REGISTER) ? "New User Information" : mode === constants.MODE_USER_UPDATE_DELETE ? "Update or Delete User" : "Update User Profile"}</u></h1>
      <UserInputs
        userData={ userData }
        onChange={ onChange }
        parentRefs={ parentRefs }
        mode={ mode }
      />
      { 
        userIsAuthorized(auth, constants.ADMIN_PERMISSIONS)
        ?
          <div className="d-flex flex-wrap justify-content-evenly">
            <Form.Check
              inline
              label="Is Active:"
              type="checkbox"
              name="isActiveCheckbox"
              onChange={ onChange }
              checked={ userData?.is_active ? userData.is_active : false }
            />
            <Form.Check
              inline
              label="Is Staff:"
              type="checkbox"
              name="isStaffCheckbox"
              onChange={ onChange }
              checked={ userData?.is_staff ? userData.is_staff : false }
            />
          </div>
        : ''
      }
      <div className="d-flex mb-4 flex-wrap justify-content-center align-items-center">
        <Form.Group className="mb-3 ms-1 me-1 text-start">
          <Form.Label htmlFor={ constants.IMAGE_FIELD_NAME } className="colorsettings_listtext">{ userData?.backendImageExists && (mode === constants.MODE_USER_UPDATE_DELETE || mode === constants.MODE_USER_PROFILE) ? "Replace existing image" : "Image"}</Form.Label>
          <Form.Control className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={ constants.IMAGE_FIELD_NAME }
            type="file" 
            onChange={ onChange }
            value={ userData?.imageFileName ? userData.imageFileName : '' }
            name="image"
            accept="image/jpeg,image/png,image/gif"
          />
        </Form.Group>
        {
          userData?.imageFileName
          ? 
            <Button variant="primary" className="h-40 ms-1 mt-3" onClick={ handleClearImageClicked }>
              Clear Selection
            </Button>
          :
          userData?.backendImageExists && ( mode === constants.MODE_USER_UPDATE_DELETE || mode === constants.MODE_USER_PROFILE )
          ? 
            <Form.Check
              className="ms-1 mt-3"
              type="checkbox"
              name="deleteExistingImageCheckbox"
              label={<b className="colorsettings_listtext">Delete Existing Image</b>}
              onChange={ onChange }
              checked={ userData?.deleteExistingImage ? userData.deleteExistingImage : false }
            />
          : ''
        }
      </div>
      { 
        ( userIsAuthorized(auth, constants.ADMIN_PERMISSIONS) && mode !== constants.MODE_USER_PROFILE)
        ?
          <ResidenceInput
            bootstrapSettings={ bootstrapSettings }
            formData={ userData }
            handleAssignResidencesClicked={ handleAssignResidencesClicked }
            handleDoneAssigningResidencesClicked={ handleDoneAssigningResidencesClicked }
            handleRemoveResidenceClicked={ handleRemoveResidenceClicked }
            mode={ residenceInputMode }
            selectedResidenceIDInResidenceSelect={ selectedResidenceIDInResidenceSelect }
            setSelectedResidenceIDInResidenceSelect={ setSelectedResidenceIDInResidenceSelect }
          />
        : ''
      }
      {
        mode === constants.MODE_USER_ADD
        ?
          <Button
            className="ms-5 me-5 colorsettings_buttonfilled"
            id="button-add"
            onClick={ handleAddUserClicked }
            type="submit"
            variant="primary"
          >
            Add User
          </Button>
        :
        ( mode === constants.MODE_USER_UPDATE_DELETE || mode === constants.MODE_USER_PROFILE )
        ?
          <div>
            <div className="d-flex flex-wrap justify-content-center">
              {
                userIsAuthorized(auth, constants.PERMISSIONS_CAN_UPDATE_USER || constants.PERMISSIONS_CAN_UPDATE_ALL_USERS)
                ?
                  <Button
                    className="me-2 colorsettings_buttonfilled"
                    id="button-update"
                    onClick={ handleUpdateUserClicked }
                    type="submit"
                    variant="primary"
                  >
                    Update User
                  </Button>
                : ''
              }
              {
                (mode === constants.MODE_USER_UPDATE_DELETE && userIsAuthorized(auth, constants.PERMISSIONS_CAN_DELETE_USER || constants.PERMISSIONS_CAN_DELETE_ALL_USERS))
                ?
                  <Button
                    className="me-2"
                    id="button-delete"
                    onClick={ handleDeleteUserClicked }
                    type="submit"
                    variant="danger"
                  >
                    Delete User
                  </Button>
                : ''
              }
              {
                mode === constants.MODE_USER_UPDATE_DELETE
                ?
                  <Button
                    className="ms-5 colorsettings_buttonoutline"
                    id="button-add-instead"
                    onClick={ handleSwitchModeToAddClicked }
                    type="button"
                    variant="outline-primary"
                  >
                    Add New User Instead
                  </Button>
                : ''
              }
            </div>
            <div className="d-flex mt-4 flex-wrap justify-content-center">
              {
                userData.fk_mailing_address === null
                ?
                  <Button
                    className="ms-5 me-5 colorsettings_buttonfilled"
                    id="button-address-add"
                    onClick={ handleAddMailingAddressClicked }
                    type="button"
                    variant="primary"
                  >
                    Add Mailing Address
                  </Button>
                :
                  <Button
                    className="ms-5 me-5 colorsettings_buttonfilled"
                    id="button-address-update"
                    onClick={ handleUpdateMailingAddressClicked }
                    type="button"
                    variant="primary"
                  >
                    Update Mailing Address
                  </Button>
              }
            </div>
          </div>
        : mode === constants.MODE_USER_SELF_REGISTER
        ?
          <Button
            className="ms-5 me-5 colorsettings_buttonfilled"
            id="button-complete"
            onClick={ handleAddUserClicked }
            type="submit"
            variant="primary"
          >
            Complete Registration
          </Button>
        : ''
      }
    </Form>
  );
}
  
  export default UserForm;