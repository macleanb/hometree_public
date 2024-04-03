
/* Internal Libraries */
import { getClient } from './apiUtils';
import constants from '../constants';

/* Logs a user in with loginData credentials */
const handlePasswordChange = async (auth, newPassword, setBackEndErrors) => {
  try {
    /* Consolidate login data */
    const loginData = {
      email: auth.user.email,
      password: newPassword
    };
      
    const response = await getClient().post(
      constants.LOGIN_URL, 
      JSON.stringify(loginData), 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    
    return response;
  } catch (error) {
    setBackEndErrors({Error: 'Error while attempting to log out and log back in with new password (handlePasswordChange).'});
  }
}

export default handlePasswordChange;