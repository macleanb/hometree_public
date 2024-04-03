////////////////
///  Imports ///
////////////////

/* External Libraries */
import Button from 'react-bootstrap/Button';


/* This component provides buttons for any CRUD operation, to be used in forms */
const CRUDButtons = ({
  displayAddButton,
  displayButtonAddInstead,
  displayDeleteButton,
  displayUpdateButton,
  handleAddClicked,
  handleDeleteClicked,
  handleSwitchModeToAddClicked,
  handleUpdateClicked,
  buttonLabel }) => 
{

  if (displayAddButton) {
    return (
      <Button
        className="ms-5 me-5 colorsettings_buttonfilled"
        id="button-add"
        onClick={ handleAddClicked }
        type="submit"
        variant="primary"
      >
        Add {buttonLabel}
      </Button>
    );
  } else {
    return (
      <div className="d-flex flex-wrap justify-content-center">
          {
            displayUpdateButton
            ?
              <Button
                className="me-2 colorsettings_buttonfilled"
                id="button-update"
                onClick={ handleUpdateClicked }
                type="submit"
                variant="primary"
                >
                Update {buttonLabel}
              </Button>
            : ''
          }
          {
            displayDeleteButton
            ?
              <Button
                className="me-2"
                id="button-delete"
                onClick={ handleDeleteClicked }
                type="submit"
                variant="danger"
              >
                Delete {buttonLabel}
              </Button>
            : ''
          }
          {
            displayButtonAddInstead
            ? 
              <Button
                className="ms-5 colorsettings_buttonoutline"
                id="button-add-instead"
                onClick={ handleSwitchModeToAddClicked }
                type="submit"
                variant="outline-primary"
              >
                Add New {buttonLabel} Instead
              </Button>
            : ''
          }
      </div>
    );
  }
}

export default CRUDButtons;