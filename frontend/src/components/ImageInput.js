/* External Imports */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Internal Imports */
import constants from '../constants';
import styles from './ImageInput.module.css';

/* This component provides an input field and controls for images, to be used in forms */
const ImageInput = ({
  formData,
  backendImageExists,
  bootstrapSettings,
  handleClearImageClicked,
  updateDeleteMode,
  onChange
}) => 
{
  return (
    <div className={ `${styles.containersize} d-flex justify-content-center ${ bootstrapSettings ? bootstrapSettings : 'mb-4' }` }>
      <Form.Group className={`${styles.size} mb-3 ms-1 me-1 text-start`} controlId={ constants.IMAGE_FIELD_NAME }>
        <Form.Label className="colorsettings_listtext">{ backendImageExists && updateDeleteMode ? "Replace existing image" : "Image"}</Form.Label>
        <Form.Control className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file" 
          onChange={ onChange }
          value={ formData?.imageFileName ? formData.imageFileName : ''}
          name="image"
          accept="image/jpeg,image/png,image/gif"
        />
      </Form.Group>
      {
        formData?.imageFileName 
        ?
          <div className={ styles.container_button_clear }>
            <Button
              className={ styles.button_clear_size }
              onClick={ handleClearImageClicked }
              variant="primary"
            >
              Clear Selection
            </Button>
          </div>
        :
        backendImageExists && updateDeleteMode
        ? 
          <Form.Check
            className="ms-1 my-auto"
            type="checkbox"
            name="deleteExistingImageCheckbox"
            label={<b className="colorsettings_listtext">Delete Existing Image</b>}
            onChange={ onChange }
            checked={ formData?.deleteExistingImage ? formData.deleteExistingImage : false }
          />
        : ''
      }
    </div>
  );
}

export default ImageInput;