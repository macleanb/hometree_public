/* External Libraries */
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import constants from '../constants';

/* This component provides an input field and controls for residences
   to be added to user forms (as owned properties) */
const ResidenceInput = ({
  bootstrapSettings,
  formData,
  //formDataResidencesChanged,
  handleAssignResidencesClicked,
  handleDoneAssigningResidencesClicked,
  handleRemoveResidenceClicked,
  mode,
  selectedResidenceIDInResidenceSelect,
  setSelectedResidenceIDInResidenceSelect,
}) => 
{

  ///////////////////////
  /*    Use Effects    */
  ///////////////////////

  useEffect(() => {
    if (formData?.residences && formData.residences.length > 0) {
      setSelectedResidenceIDInResidenceSelect(formData.residences[0].id);
    }
  }, [formData?.residences?.length]);


  /////////////////
  /*    Render   */
  /////////////////

  return (
    <div className={ `d-flex flex-wrap justify-content-center align-items-center ${ bootstrapSettings ? bootstrapSettings : 'mb-4' }`}>
      <Form.Group className="mb-3 ms-1 me-1 text-start" controlId={ constants.RESIDENCEINPUT_FIELD_NAME }>
        <Form.Label className="colorsettings_listtext">{ "Assign Residence(s)"}</Form.Label>
        <div className="d-flex flex-wrap shadow residenceinputdiv">
          {
            mode === constants.MODE_ASSIGN_RESIDENCES
            ?
              <Button variant="primary" className="p-0 border-0 rounded-0 residenceinputbutton" onClick={ handleDoneAssigningResidencesClicked }>
                Done Assigning
              </Button>
            :
              <Button variant="light" className="p-0 border-0 rounded-0 residenceinputbutton" onClick={ handleAssignResidencesClicked }>
                Assign Residences
              </Button>
          }
          <Form.Select
            className="border-0 rounded-0 text-gray-700 residenceinputselect"
            aria-label="Assign residences"
            onChange={ (e) => { 
              setSelectedResidenceIDInResidenceSelect(e.target.value)
            }}
            value={
                    selectedResidenceIDInResidenceSelect
                    ?
                      selectedResidenceIDInResidenceSelect
                    :
                      !formData?.residences || formData.residences === 0
                      ?
                        '-1'
                      :
                        formData.residences[0].id
                  }>
            {
              !formData?.residences || formData.residences.length === 0
              ?
                <option value="-1">No residences currently assigned</option>
              : ''
            }
            {
              formData?.residences
              ?
              formData.residences.map((residence) => {
                return <option key={residence.id} value={residence.id}>{`${residence.street} ${residence.street_2 ? residence.street_2 : ''} ${residence.city}`}</option>
              })
              : ''
            }
          </Form.Select>
        </div>
      </Form.Group>
      {
        formData?.residences && formData.residences.length > 0
        ? 
          <Button variant="primary" className="h-40 ms-1 mt-3" onClick={ handleRemoveResidenceClicked }>
            Remove Residence
          </Button>
        : ''
      }
    </div>
  );
}

export default ResidenceInput;