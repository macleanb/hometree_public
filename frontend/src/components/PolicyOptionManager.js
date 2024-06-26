/* External Imports */
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Imports */
import constants from '../constants';
import styles from './PolicyOptionManager.module.css';

/* This component provides input fields and controls for policy
   options to be added to policy forms */
const PolicyOptionManager = ({
  bootstrapSettings,
  formData,
  handleAddOptionClicked,
  handleRemoveOptionClicked,
  onChange,
  selectedOptionInOptionSelect,
  setSelectedOptionInOptionSelect,
}) => 
{

  ///////////////////////
  /*    Use Effects    */
  ///////////////////////

  useEffect(() => {
    if (formData?.options && formData.options.length > 0) {
      setSelectedOptionInOptionSelect(0);
    }
  }, [formData?.options?.length]);


  /////////////////
  /*    Render   */
  /////////////////

  return (
    <div className={ `d-flex flex-wrap justify-content-center align-items-center ${ bootstrapSettings ? bootstrapSettings : 'mb-4' }`}>
      <Form.Group className={`${ styles.form_group_size } mb-3 ms-1 me-1 text-start`} controlId={ constants.FIELD_NAME_OPTION_INPUT }>
        <Form.Label className="colorsettings_listtext">{ "Manage Options"}</Form.Label>
        <div className={`${styles.inner_div_size} d-flex flex-wrap`}>
          <Form.Control
            className="mb-0 optioninputfield"
            type="text" 
            placeholder="Enter option text..." 
            onChange={ onChange }
            value={ formData.option_text ? formData.option_text : ''}
            name="option_text"
          />
          <Button variant="primary" className={ styles.button_size_add } onClick={ handleAddOptionClicked }>
              Add Option
          </Button>
        </div>
        <div className={`${styles.inner_div_size} d-flex flex-wrap`}>
          <Form.Select
            className={`${ styles.select_size } optioninputselect`}
            aria-label="select option to remove"
            onChange={ (e) => { 
              setSelectedOptionInOptionSelect(e.target.value)
            }}
            value={
                    selectedOptionInOptionSelect
                    ?
                      selectedOptionInOptionSelect
                    :
                      !formData?.options || formData.options.length === 0
                      ?
                        '-1'
                      :
                        0
          }>
            {
              !formData?.options || formData.options.length === 0
              ?
                <option value="-1">No options currently assigned</option>
              : ''
            }
            {
              formData?.options
              ?
              formData.options.map((option, index) => {
                return <option key={index} value={index}>{`${option.option_text}`}</option>
              })
              : ''
            }
          </Form.Select>
          {
            formData?.options && formData.options.length > 0
            ? 
              <Button variant="primary" className="mt-1 optionbutton" onClick={ handleRemoveOptionClicked }>
                Remove Option
              </Button>
            : ''
          }
        </div>
      </Form.Group>
    </div>
  );
}

export default PolicyOptionManager;