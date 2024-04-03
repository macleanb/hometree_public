////////////////
///  Imports ///
////////////////

/* External Libraries */
import axios from 'axios';
import React, {
  useState,
  useEffect,
  useRef,
  useContext
} from 'react';
import { useNavigate } from 'react-router-dom';

/* Internal Libraries */
import AuthContext from '../contexts/AuthProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import constants from '../constants';
import ErrorDisplay from '../components/ErrorDisplay'
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import LoginForm from '../forms/LoginForm';
import logo from '../HTfulllogo.png';
import { parseAndSetAuth } from '../utils/authUtils';
import reportLoginFormValidity from '../utils/reportLoginFormValidity';
import {
  emptyLoginData,
  loginUser
} from '../utils/userUtils';
import { getResponseError } from '../utils/errorUtils';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const Login = () => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth, setAuth } = useContext(AuthContext);
  const { backEndErrors, setBackEndErrors } = useContext(BackEndErrorContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);

  /* State Declarations */
  const [ formData, setFormData ] = useState(emptyLoginData());

  /* Ref Declarations */
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);

  /* Other Declarations */
  const navigate = useNavigate();

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Clears all error message */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);

    if (inputEmailRef?.current) {
      inputEmailRef.current.setCustomValidity('');
    }

    if (inputPasswordRef?.current) {
      inputPasswordRef.current.setCustomValidity('');
    }
  }


  //////////////////////
  /// Event Handlers ///
  //////////////////////

  const onChange = e => {
    /* For all field changes, use the generic set function */
    setFormData({ ...formData, [e.target.name]: e.target.value });

    /* Clear the error state after the user modifies the
    username or password fields */
    clearErrorStates();
  }

  /* See if the user is already logged in.  If so, redirect to home. */
  useEffect(() => {
    if (auth && auth.status && navigate) {
      if (auth.status === constants.STATUS_AUTHENTICATED) {      
        navigate('/home');
      }
    }
  }, [auth, navigate]); // Re-run each time a dependency comes to life

  
  /* Handles a submit button event */
  const handleLoginClicked = async (e) => {
    e.preventDefault();

    /* Check for validation errors and report as needed. */
    const formIsValid = await reportLoginFormValidity(formData, {
      inputEmailRef: inputEmailRef,
      inputPasswordRef: inputPasswordRef
    });

    if (formIsValid) {
      try {
        const response = await loginUser(formData, setBackEndErrors);

        if (response?.data?.user) {
          /* This should trigger above useEffect and redirect */
          parseAndSetAuth(response.data, setAuth);
        }

      } catch (error) {
        if (!error?.response) {
          setBackEndErrors({Error: 'No Server Response'});
        } else if (error.response?.status === 400) {
          setBackEndErrors(getResponseError(error));
        } else if (error.response?.status === 401) {
          setBackEndErrors(getResponseError(error));
          setBackEndErrors({...backEndErrors, Error: 'Invalid email or password'});
        } else if (error.response?.status === 403) {
          setBackEndErrors({ Error: 'User may already be logged in.'});
        } else {
          setBackEndErrors(getResponseError(error)); // new way that requires custom User model and validators assigned to fields on the backend
          setBackEndErrors({...backEndErrors, Error: 'Login failed.'});
        }

        setAuth({status: constants.STATUS_NOT_AUTHENTICATED});

        // Reset the input fields
        setFormData(emptyLoginData());
      }
    }
  }

  const handleSignUpClicked = (e) => {
    navigate('/register');
  }


  return (
    <div id="logincontainer" className="d-flex justify-content-center align-items-center">
      <ErrorDisplay />
      <img src={ logo } className="ms-5" width={1000} height={750} alt="hometree logo"></img>
      <div className="logintile center">
        <h1>Sign In</h1>
        <br/>
        <LoginForm
          formData={ formData }
          handleLoginClicked={ handleLoginClicked }
          onChange={ onChange }
          parentRefs={
            {
              inputEmailRef: inputEmailRef,
              inputPasswordRef: inputPasswordRef
            }
          }
        />
        <br/>
        <a href='' onClick={ handleSignUpClicked }>Sign Up</a>
      </div>
    </div>
  );
}

export default Login;
