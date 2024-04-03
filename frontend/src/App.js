////////////////
///  Imports ///
////////////////

/* External Libraries */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import React from 'react';

/* Internal Imports */
import AuthContext from './contexts/AuthProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { BackEndErrorProvider } from './contexts/BackEndErrorProvider';
import { FrontEndErrorProvider } from './contexts/FrontEndErrorProvider';
import { SuccessProvider } from './contexts/SuccessProvider';

/* This is a Homeowner's Association App */
const App = () => {
  const auth = useContext(AuthContext);
  /* Even though permissions isn't used, removing it
     leads to an error when login is attempted, because for some reason
     the useEffect below suddenly would require setUserPermissions
     to be added as a dependency.  useEffect does NOT require
     setUserPermissions to be a dependency as long as permissions
     is deconstructed here. */
  const [permissions, setUserPermissions] = useState([]);

  
  useEffect(() => {
    if (auth?.auth?.permissions) {
      setUserPermissions(auth.auth.permissions);
    } else {
      setUserPermissions(null);
    }
  }, [auth]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <SuccessProvider>
          <BackEndErrorProvider>
            <FrontEndErrorProvider>
              <main className="App">
                <Outlet context={{}}/>
              </main>
            </FrontEndErrorProvider>
          </BackEndErrorProvider>
        </SuccessProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;

