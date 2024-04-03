/* External Imports */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React, { useContext, useState, useEffect } from 'react';

/* Internal Imports */
import SuccessContext from '../contexts/SuccessProvider';

/* Displays a success modal wrapped in a Form.  The Form is needed
   to support closing it with the enter key; however, even though 
   the enter key closes the Modal, the Form wrapper is retained
   in the virtual DOM */ 
const SuccessDisplay = ({ parentHandlers }) => {
  const { successMessages, setSuccessMessages } = useContext(SuccessContext);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    if (parentHandlers?.handleClose) {
      parentHandlers.handleClose();
    }

    setSuccessMessages(null);
    setShow(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClose();
    }
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    if ( successMessages && Object.keys(successMessages).length > 0 ) {
      handleShow();
    }
  }, [successMessages]);


  return (
    <section id="successdisplaycontainer" className="d-flex flex-fill flex-column flex-wrap border-left justify-content-center">
      {
        <Form role="form" onKeyDown={ handleKeyDown }>
          <Modal show={ show } onHide={ handleClose }>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
              {
                successMessages
                ?
                  Object.entries(successMessages).map(([field, message]) => {
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

export default SuccessDisplay;
