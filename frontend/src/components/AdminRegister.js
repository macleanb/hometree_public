import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef, useContext } from 'react';
import constants from '../constants';
import AuthContext from '../contexts/AuthProvider';
import { userIsAuthorized } from '../utils/authUtils';
import { getResponseError } from '../utils/errorUtils';

const client = axios.create({
    baseURL: constants.BASE_URL
  });

const AdminRegister = ({ userDataChangeSwitch, setUserDataChangeSwitch }) => {
    const [auth_email, setAuth_Email] = useState('');
    const [pass_word, setPass_Word] = useState('');
    const [first_name, setFirst_Name] = useState('');
    const [last_name, setLast_Name] = useState('');
    const [ street, setStreet ] = useState('');
    const [ street2, setStreet2 ] = useState('');
    const [ city, setCity ] = useState('');
    const [ addrState, setAddrState ] = useState('');
    const [ zipcode, setZipcode ] = useState('');
    const [ isActiveChecked, setIsActiveChecked ] = useState(false);
    const [ isStaffChecked, setIsStaffChecked ] = useState(false); 
    const [frontendError, setFrontendError] = useState(''); // should hold a single string message
    const [backendErrors, setBackendErrors] = useState(null) // can hold many error messages
    const errRef = useRef();
    const userRef = useRef();
    const { auth } = useContext(AuthContext);

    ////////////////////
    /* Helper Methods */
    ////////////////////

    // TODO update createAddressAndGetID to create an actual
    // address first and then return the ID of the created
    // address
    const createAddressAndGetID = () => {
      return 1;
    }

    const getUserCredentials = () => {
        return {
          email: auth_email,
          password: pass_word,
          first_name: first_name,
          last_name: last_name,
          is_active: isActiveChecked,
          is_staff: isStaffChecked,
          fk_mailing_address: createAddressAndGetID()
        }
    }

    ///////////////////
    /* State Methods */
    ///////////////////

    /* Put the focus on the right thing after the 
       page loads */
    useEffect(() => {
        userRef.current.focus();
    }, []);
  
  
      /* Clear the error state after the user modifies the
          username or password fields */
    useEffect(() => {
        setFrontendError('');
        setBackendErrors(null);
    }, [auth_email, pass_word, first_name, last_name]);


    const submitRegistration = async (event) => {
      event.preventDefault();

      /* First see if user has permissions to create */
      if (!userIsAuthorized(auth, constants.PERMISSIONS_CAN_ADD_USER)) {
        setFrontendError("Error: you don't have the required permissions to add a user.");
        errRef.current.focus();
        return;
      }

      const credentials = getUserCredentials();

      /* Handle any blank username/password fields on the 
          front end rather than sending blank credentials to the server */
      if (credentials.auth_email === '') {
        setFrontendError('Error: missing email');
        errRef.current.focus();
      } else if (credentials.password === '') {
        setFrontendError('Error: missing password');
        errRef.current.focus();
      } else if (credentials.first_name === '' ) {
        setFrontendError('Error: missing first name');
        errRef.current.focus();
      } else if (credentials.last_name === '') {
        setFrontendError('Error: missing last name');
        errRef.current.focus();
      } else {
        // Since admin is logged in and there is a session, must also 
        // send the csrf token
        try {
          //Read all cookies
          const allCookies = document.cookie;
    
          // Get specific cookie (csrftoken)
          const csrfToken = allCookies
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

          const registrationResponse = await client.post(
            constants.REGISTER_URL, 
            JSON.stringify(credentials), 
            {
              headers: { 'Content-Type': 'application/json',
                         "X-CSRFToken": csrfToken
              },
              withCredentials: true
            }
          );

          /* Notify the userDisplay that userData changed */
          if (registrationResponse) {
            // Reverse whatever value is in userData to change it
            if (userDataChangeSwitch) {
              setUserDataChangeSwitch(false);
            } else {
              setUserDataChangeSwitch(true);
            }
          }

          // Reset the input fields
          setFirst_Name('');
          setLast_Name('');
          setAuth_Email('');
          setPass_Word('');
          setIsActiveChecked(false);
          setIsStaffChecked(false);

        } catch (error) {
          if (!error?.response) {
            setFrontendError('Server Error: No Server Response');
          } else if (error.response?.status === 400) {
            setBackendErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
          } else {
            setFrontendError('Registration failed');
          }

          if (errRef?.current) {
            errRef.current.focus();
          }
        }
      }
    }


    return (
      <section id="adminregistercontainer" className="d-flex flex-fill flex-column flex-wrap border-left justify-content-center p-1">
        {/* From Dave Gray https://www.youtube.com/watch?v=X3qyxo_UTR4&t=676s */}
        {/* This makes any errors populate at the top of the screen, capture the focus, and get
            automatically read to the user by aria-live screenreader */}
        { 
          backendErrors
            ?
              Object.entries(backendErrors).map(([field, message]) => {
                return (<p ref={errRef} key={field} className="errmsg" aria-live="assertive">{field}: {message}</p>);
              })
            : null
        }
        <p ref={errRef} className={frontendError ? "errmsg" : "offscreen"} aria-live="assertive">{frontendError}</p>
        <div className="d-flex m-0 p-2 flex-column flex-fill adminregistertile center">
        <h1>Add User</h1>
          <br/>
          <Form>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Group className="mb-3 me-3" controlId={ constants.FIRST_NAME_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter first name" 
                    onChange={ (e) => setFirst_Name(e.target.value) }
                    value={first_name}
                    required
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3 me-3" controlId={ constants.LAST_NAME_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter last name" 
                    onChange={ (e) => setLast_Name(e.target.value) }
                    value={last_name}
                    required
                  />
                </Form.Label>
              </Form.Group>
            </div>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Group className="mb-3" controlId={ constants.AUTH_EMAIL_FIELD_NAME } >
                <Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    onChange={ (e) => setAuth_Email(e.target.value) }
                    value={auth_email} 
                    required
                    ref={ userRef }
                    autoComplete="off"
                  />
                </Form.Label>
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId={ constants.PASSWORD_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter password" 
                    onChange={ (e) => setPass_Word(e.target.value) }
                    value={pass_word}
                    required
                  />
                </Form.Label>
              </Form.Group>
            </div>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Check
                inline
                label="Is Active:"
                type="checkbox"
                onChange={ (e) => setIsActiveChecked(e.target.checked) }
                checked={isActiveChecked}
              />
              <Form.Check
                inline
                label="Is Staff:"
                type="checkbox"
                onChange={ (e) => setIsStaffChecked(e.target.checked) }
                checked={isStaffChecked}
              />
            </div>
            <h3>Mailing Address Information</h3>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Group className="mb-3 me-3" controlId={ constants.STREET_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Street" 
                    onChange={ (e) => setStreet(e.target.value) }
                    value={street}
                    required
                  />
                </Form.Label>
              </Form.Group>
            </div>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Group className="mb-3 me-3" controlId={ constants.STREET2_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Additional Street Info." 
                    onChange={ (e) => setStreet2(e.target.value) }
                    value={street2}
                    required
                  />
                </Form.Label>
              </Form.Group>
            </div>
            <div className="d-flex flex-wrap justify-content-evently">
              <Form.Group className="mb-3 me-3" controlId={ constants.CITY_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter City" 
                    onChange={ (e) => setCity(e.target.value) }
                    value={city}
                    required
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3 me-3" controlId={ constants.ADDR_STATE_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter State" 
                    onChange={ (e) => setAddrState(e.target.value) }
                    value={addrState}
                    required
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3 me-3" controlId={ constants.ZIPCODE_FIELD_NAME }>
                <Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Zip" 
                    onChange={ (e) => setZipcode(e.target.value) }
                    value={zipcode}
                    required
                  />
                </Form.Label>
              </Form.Group>
            </div>
            <Button variant="primary" type="submit" onClick={ submitRegistration }>
              Add User
            </Button>
          </Form>
        </div>
      </section>
    );
}

export default AdminRegister;