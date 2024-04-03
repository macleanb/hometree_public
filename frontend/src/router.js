/* External Imports */
import { createBrowserRouter } from 'react-router-dom';

/* Internal Imports */
import AddressManager from './pages/AddressManager';
import AnnouncementManager from './pages/AnnouncementManager';
import App from './App.js';
import constants from './constants.js';
import Error from './pages/Error';
import Home from "./pages/Home";
import Login from './pages/Login';
import Logout from './pages/Logout';
import PolicyDashboard from './pages/PolicyDashboard';
import PolicyManager from './pages/PolicyManager';
import ProtectedRoute from './components/ProtectedRoute.js';
import SelfRegistration from './pages/SelfRegistration';
import ResidenceManager from './pages/ResidenceManager';
import Unauthorized from './components/Unauthorized';
import UserManager from './pages/UserManager';
import UserProfileManager from './pages/UserProfileManager';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* Unprotected Routes */
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'error/',
        element: <Error />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/logout',
        element: <Logout />
      },
      {
        path: '/register',
        element: <SelfRegistration />
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      },

      /* Should be Protected Routes Requiring Admin Permissions */
      {
        path: '/addressmanager',
        element: <ProtectedRoute permissionsRequired={constants.ADMIN_PERMISSIONS}>
                   <AddressManager />
                 </ProtectedRoute>
      },
      {
        path: '/announcementmanager',
        element: <ProtectedRoute permissionsRequired={constants.ADMIN_PERMISSIONS}>
                   <AnnouncementManager />
                 </ProtectedRoute>,
      },
      {
        path: '/policymanager',
        element: <ProtectedRoute permissionsRequired={constants.ADMIN_PERMISSIONS}>
                   <PolicyManager />
                 </ProtectedRoute>,
      },
      {
        path: '/residencemanager',
        element: <ProtectedRoute permissionsRequired={constants.ADMIN_PERMISSIONS}>
                   <ResidenceManager />
                 </ProtectedRoute>,
      },
      {
        path: '/usermanager',
        element: <ProtectedRoute permissionsRequired={constants.ADMIN_PERMISSIONS}>
                   <UserManager />
                 </ProtectedRoute>,
      },

      /* Should be Protected Routes Requiring Basic Permissions */
      {
        path: '/policydashboard',
        element: <ProtectedRoute permissionsRequired={constants.BASIC_USER_PERMISSIONS}>
                   <PolicyDashboard />
                 </ProtectedRoute>,
      },
      {
        path: '/userprofilemanager',
        element: <ProtectedRoute permissionsRequired={constants.BASIC_USER_PERMISSIONS}>
                   <UserProfileManager />
                 </ProtectedRoute>,
      },

      /* All other routes (unprotected) */
      {
        path: "*",
        element: <Error />
      },
    ],
    errorElement: <Error />, 
  },
]);

export default router;
