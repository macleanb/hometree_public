/* External Imports */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React, { useContext, useEffect, useState } from 'react';

/* Internal Imports */
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';

/* Displays an error modal wrapped in a Form.  The Form is needed
   to support closing it with the enter key; however, even though 
   the enter key closes the Modal, the Form wrapper is retained
   in the virtual DOM */ 
const ErrorDisplay = () => {
  const { frontEndErrors } = useContext(FrontEndErrorContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const [show, setShow] = useState(false);

  /* Leave frontEndErrors so they continue to display until user takes action */
  const handleClose = (e) => {
    setBackEndErrors(null);
    setShow(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClose();
    }
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    if (( frontEndErrors && Object.keys(frontEndErrors).length > 0 ) || ( backEndErrors && Object.keys(backEndErrors).length > 0)) {
        handleShow();
    }
  }, [frontEndErrors, backEndErrors]);

  return (
    <section id="errordisplaycontainer" className="d-flex flex-column flex-wrap border-left justify-content-center">
      {
        <Form role="form" onKeyDown={ handleKeyDown }>
          <Modal show={ show } onHide={ handleClose } onKeyDown={ handleKeyDown }>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
              { 
                backEndErrors
                ?
                  Object.entries(backEndErrors).map(([field, message]) => {
                    return (<p key={field} aria-live="assertive">{field}: {message}</p>);
                  })
                : ''
              }
              { 
                frontEndErrors
                ?
                  Object.entries(frontEndErrors).map(([field, message]) => {
                    return (<p key={field} aria-live="assertive">{message}</p>);
                  })
                : ''
              }
            </Modal.Body>
    
            <Modal.Footer>
              <Button variant="primary" onClick={ handleClose }>Acknowledge</Button>
            </Modal.Footer>
          </Modal>
        </Form>
      }
    </section>
  );
}

export default ErrorDisplay;
