////////////////
///  Imports ///
////////////////

/* External Libraries */
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

/* Internal Libraries */
import constants from '../constants';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';

/* This component provides input fields for announcements, to be used in forms */
const AnnouncementInputs = ( { formData, onChange, bootstrapSettings } ) => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  const { frontEndErrors } = useContext(FrontEndErrorContext);

  return (
    <div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.ANNOUNCEMENT_TITLE_FIELD_NAME }>
          <Form.Label className="colorsettings_listtext">Title</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter title..." 
            onChange={ onChange }
            value={ formData.title ? formData.title : ''}
            required
            name="title"
          />
          {
            frontEndErrors?.title && (
              <Form.Text className="alert-danger ms-2 text-danger" tooltip="true">
                {frontEndErrors.title}
              </Form.Text>
            )
          }
        </Form.Group>
      </div>
      <div>
        <Form.Group className={ `text-start ${ bootstrapSettings ? bootstrapSettings : 'mb-4'}`} controlId={ constants.ANNOUNCEMENT_BODYTEXT_FIELD_NAME }>
          <Form.Label className="colorsettings_listtext">Body</Form.Label>
          <Form.Control 
            // type="text" 
            as="textarea"
            placeholder="Enter announcement text..." 
            onChange={ onChange }
            rows={5}
            value={ formData.bodytext ? formData.bodytext : '' }
            name="bodytext"
          />
        </Form.Group>
      </div>
    </div>
  );
}

export default AnnouncementInputs;