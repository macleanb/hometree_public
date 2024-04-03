////////////////
///  Imports ///
////////////////

/* External Libraries */
import Form from 'react-bootstrap/Form';

/* This component provides an input field for picking dates, to be used in forms */
const DateInput = ({
  bootstrapSettings,
  controlId,
  formData,
  label,
  name,
  onChange,
  required
}) => 
{

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  return (
    <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ controlId }>
        <Form.Label className="colorsettings_listtext">{ label }</Form.Label>
        {
          required
          ?
            <Form.Control 
              type="date" 
              placeholder="DateRange" 
              onChange={ onChange }
              value={ formData[name] ? formData[name] : new Date().toISOString().split('T')[0]}
              name={ name }
              required
            />
          :
            <Form.Control 
              type="date" 
              placeholder="DateRange" 
              onChange={ onChange }
              value={ formData[name] ? formData[name] : new Date().toISOString().split('T')[0]}
              name={ name }
            />
        }

    </Form.Group>
  );
}

export default DateInput;