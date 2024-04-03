/* External Imports */
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';

/* Internal Imports */
import AuthContext from '../contexts/AuthProvider';
import { userIsAuthorized } from '../utils/authUtils';

const ProtectedRoute = ({children, permissionsRequired}) => {

  ///////////////////////
  ///   Declarations  ///
  ///////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  /* First check to see if the user auth has a permission that is included in the
      requiredPermissions array.
        - Check to see if there is even a user logged in.
          - If not, navigate to the login page.
        - If a user is logged in and has required permissions,
          return the child protected by this component.
        - If a user is logged in but lacks required permissions, 
          navigate to an unauthorized page.
          */

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace/>;
  }

  if (userIsAuthorized(auth, permissionsRequired)) {
    return children;
  } else {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
