////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import constants from '../constants';

/* This component provides an input field and controls for users
   to be added as owners of something, to be used in forms */
const OwnerInput = ({
  bootstrapSettings,
  formData,
  //formDataOwnersChanged,
  handleAssignOwnersClicked,
  handleDoneAssigningOwnersClicked,
  handleRemoveOwnerClicked,
  mode,
  selectedOwnerIDInOwnerSelect,
  setSelectedOwnerIDInOwnerSelect,
}) => 
{
  /* Whenever formData.owners changes (meaning an owner button was clicked),
     set the selected owner ID to the top one */
  // useEffect(() => {
  //   if (formData?.owners && formData.owners.length > 0) {
  //     setSelectedOwnerIDInOwnerSelect(formData.owners[0].id);
  //   }
  // }, [formDataOwnersChanged, formData?.owners]);

  useEffect(() => {
    if (formData?.owners && formData.owners.length > 0) {
      setSelectedOwnerIDInOwnerSelect(formData.owners[0].id);
    }
  }, [formData?.owners?.length]);

  return (
    <div className={ `d-flex flex-wrap justify-content-center align-items-center ${ bootstrapSettings ? bootstrapSettings : 'mb-4' }`} id="ownerinput">
      <Form.Group className="mb-3 ms-1 me-1 text-start" controlId={ constants.OWNERINPUT_FIELD_NAME }>
        <Form.Label className="colorsettings_listtext">{ "Assign Owner(s)"}</Form.Label>
        <div className="d-flex flex-wrap shadow ownerinputdiv">
          {
            mode === constants.MODE_ASSIGN_OWNERS
            ?
              <Button variant="primary" className="p-0 border-0 rounded-0 ownerinputbutton" onClick={ handleDoneAssigningOwnersClicked }>
                Done Assigning
              </Button>
            :
              <Button variant="light" className="p-0 border-0 rounded-0 ownerinputbutton" onClick={ handleAssignOwnersClicked }>
                Assign Owners
              </Button>
          }
          <Form.Select
            className="border-0 rounded-0 text-gray-700 ownerinputselect"
            aria-label="Assign owners"
            onChange={ (e) => { 
              setSelectedOwnerIDInOwnerSelect(e.target.value)
            }}
            value={
                    selectedOwnerIDInOwnerSelect
                    ?
                      selectedOwnerIDInOwnerSelect
                    :
                      !formData?.owners || formData.owners.length === 0
                      ?
                        '-1'
                      :
                        formData.owners[0].id
                  }>
            {
              !formData?.owners || formData.owners.length === 0
              ?
                <option value="-1">No owners currently assigned</option>
              : ''
            }
            {
              formData?.owners
              ?
              formData.owners.map((owner) => {
                return <option key={owner.id} value={owner.id}>{`${owner.last_name}, ${owner.first_name} (${owner.email})`}</option>
              })
              : ''
            }
          </Form.Select>
        </div>
      </Form.Group>
      {
        formData?.owners && formData.owners.length > 0
        ? 
          <Button variant="primary" className="h-40 ms-1 mt-3" onClick={ handleRemoveOwnerClicked }>
            Remove Owner
          </Button>
        : ''
      }
    </div>
  );
}

export default OwnerInput;