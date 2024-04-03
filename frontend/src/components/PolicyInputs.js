////////////////
///  Imports ///
////////////////

/* External Libraries */
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import constants from '../constants';
import DateInput from './DateInput';

/* This component provides input fields for policies, to be used in forms */
const PolicyInputs = ({ 
  bootstrapSettings,
  formData,
  onChange
}) => 
{

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  return (
    <div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.FIELD_NAME_POLICY_STATEMENT }>
          <Form.Label className="colorsettings_listtext">Policy</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter policy statement..." 
            onChange={ onChange }
            value={ formData.statement ? formData.statement : ''}
            required
            name="statement"
          />
        </Form.Group>
      </div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.FIELD_NAME_POLICY_QUESTION }>
          <Form.Label className="colorsettings_listtext">Policy Question</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter policy question..." 
            onChange={ onChange }
            value={ formData.question ? formData.question : '' }
            required
            name="question"
          />
        </Form.Group>
      </div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.FIELD_NAME_POLICY_DESCRIPTION }>
          <Form.Label className="colorsettings_listtext">Policy Description</Form.Label>
          <Form.Control 
            as="textarea"
            placeholder="Enter policy description text..." 
            onChange={ onChange }
            rows={2}
            value={ formData.description ? formData.description: '' }
            name="description"
          />
        </Form.Group>
      </div>
      <div>
        <DateInput
          bootstrapSettings={ bootstrapSettings }
          controlId={ constants.FIELD_NAME_POLICY_EFFECTIVE_DATE }
          formData={ formData }
          label="Effective Date:"
          name="effective_date"
          onChange={ onChange }
          required={ true }
        />
      </div>
    </div>
  );
}

export default PolicyInputs;