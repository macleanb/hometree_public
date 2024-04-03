import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import axios from 'axios';
import constants from '../constants';
import AuthContext from '../contexts/AuthProvider';
import { getAuthEmail } from '../utils/authUtils';


const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
  });


const Logout = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigate && setAuth) {    
          try{
            /* From https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
            Read all cookies */
            const allCookies = document.cookie;
      
            // Get specific cookie (csrftoken)
            const csrfToken = allCookies
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1];
      
            // Provide cookie to post
            client.post(
            constants.LOGOUT_URL,
            {withCredentials: true},
            {
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": csrfToken
              }
            }
            ).then(
            function(result) {
              setAuth(null);
              
              // Erase the CSRF Token from cookies
              document.cookie = 'csrftoken=; Max-Age=-99999999;';
      
              // Before navigating to Login, wait a sec to ensure props/context items update
              setTimeout(1000);
              navigate('/login');
            }).catch(
              function(error) {
              //console.log(error);

              // Before navigating to Login, wait a sec to see if the props/context items update
              setTimeout(1000);
              navigate('/login');
            });
          } catch (e) {
            console.log(`Error in Logout.js.  ${e}`)
          }
        }
    }, [navigate, setAuth]);


    if (auth && getAuthEmail(auth)) {
        return (
            <h1>User info found...logging out.</h1>
        );
    } else {
        return (
            <h1>Retrieving user info to logout...</h1>
        );
    }

}

export default Logout;