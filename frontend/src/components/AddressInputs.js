////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import constants from '../constants';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';

/* This component provides input fields for addresses, to be used in forms */
const AddressInputs = ( { addrData, onChange, bootstrapSettings } ) => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  const { frontEndErrors } = useContext(FrontEndErrorContext);

  return (
    <div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.STREET_FIELD_NAME }>
          <Form.Label className="colorsettings_listtext">Street</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Street" 
            onChange={ onChange }
            value={ addrData.street ? addrData.street : ''}
            required
            name="street"
            autoFocus
          />
          {
            frontEndErrors?.street && (
              <Form.Text className="alert-danger ms-2 text-danger" tooltip="true">
                {frontEndErrors.street}
              </Form.Text>
            )
          }
        </Form.Group>
      </div>
        <div>
          <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.STREET2_FIELD_NAME }>
            <Form.Label className="colorsettings_listtext">Street (2)</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Additional Street Info." 
              onChange={ onChange }
              value={ addrData.street_2 ? addrData.street_2 : '' }
              name="street_2"
            />
          </Form.Group>
        </div>
        <div className="d-flex flex-wrap justify-content-evenly">
          <Form.Group className={ `d-flex me-2 flex-column flex-fill text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.CITY_FIELD_NAME }>
            <Form.Label className="colorsettings_listtext">City</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter City" 
              onChange={ onChange }
              value={ addrData.city ? addrData.city : ''}
              required
              name="city"
            />
            {
              frontEndErrors?.city && (
                <Form.Text className="alert-danger ms-2 text-danger" tooltip="true">
                  {frontEndErrors.city}
                </Form.Text>
              )
            }
          </Form.Group>
          <Form.Group className={ `d-flex me-2 flex-column flex-fill text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.ADDR_STATE_FIELD_NAME }>
            <Form.Label className="colorsettings_listtext">State</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter State" 
              onChange={ onChange }
              value={ addrData.addr_state ? addrData.addr_state : ''}
              required
              name="addr_state"
            />
            {
              frontEndErrors?.addr_state && (
                <Form.Text className="alert-danger ms-2 text-danger" tooltip="true">
                  {frontEndErrors.addr_state}
                </Form.Text>
              )
            }
          </Form.Group>
          <Form.Group className={ `d-flex me-2 flex-column flex-fill text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.ZIPCODE_FIELD_NAME }>
            <Form.Label className="colorsettings_listtext">Zip Code</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter Zip" 
              onChange={ onChange }
              value={ addrData.zipcode ? addrData.zipcode : ''}
              required
              name="zipcode"
            />
            {
              frontEndErrors?.zipcode && (
                <Form.Text className="alert-danger ms-2 text-danger" tooltip="true">
                  {frontEndErrors.zipcode}
                </Form.Text>
              )
            }
          </Form.Group>
        </div>
    </div>
  );
}

export default AddressInputs;