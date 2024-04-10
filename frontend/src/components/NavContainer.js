/* External Imports */
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthProvider';
import { userIsAuthorized, getAuthFirstName, getAuthLastName } from '../utils/authUtils';
import constants from '../constants';
import logo from '../HTlogo.png';
import brand from '../HTBrand.png';
import FrontEndErrorContext from '../contexts/FrontEndErrorProvider';
import BackEndErrorContext from '../contexts/BackEndErrorProvider';
import SuccessContext from '../contexts/SuccessProvider';

/* Internal Imports */
import { getClient } from '../utils/apiUtils';
import getTemperatureURL from '../utils/getTemperatureURL';
import getURL_WeatherIcon from '../utils/getURL_WeatherIcon';


const NavContainer = () => {

  ////////////////////////
  ///   Declarations   ///
  ////////////////////////

  /* Context Declarations */
  const { auth } = useContext(AuthContext);
  const { setFrontEndErrors } = useContext(FrontEndErrorContext);
  const { setBackEndErrors } = useContext(BackEndErrorContext);
  const { setSuccessMessages } = useContext(SuccessContext);

  /* State Declarations */
  const [ currentTemp, setCurrentTemp ] = useState();
  const [ weatherIconCode, setWeatherIconCode ] = useState();

  //////////////////////////
  ///   Helper Methods   ///
  //////////////////////////

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }

  ///////////////////////
  ///   Use Effects   ///
  ///////////////////////

  /* Get temperature data from proxy */
  useEffect(() => {
    /* Create 'active' variable for clean-up up purposes */
    let active = true;

    /* Get temperature data from backend proxy server */
    const getTemperatureData = async () => {
      const client = getClient();

      try {
        /* Get data from API then set to currentTemp state */
        const response = await client.get(getTemperatureURL());
        if (response.status === 200 && active) {
          setCurrentTemp(response.data.temp);
          setWeatherIconCode(response.data.icon);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTemperatureData();

    /* Clean up */
    return () => {
      active = false;
    }
  },[]);

  //////////////////
  ///   Render   ///
  //////////////////

  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    
    return (
      <Navbar expand="lg" className="shadow justify-content-center colorsettings_navbackground navbar">
        <Container className="ms-1 me-3 mw-100 w-100">
          <img src={ logo } width={50} height={40} alt="tree silhouette logo"></img>
          <Navbar.Brand className="d-flex ms-2 p-0 flex-column">
            <Nav.Link as={Link} to="/home">
              <img src={ brand } width={150} height={50} alt="home tree brandname"></img>
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
            <Nav>
              <Nav.Link as={Link} id="link-home" style={{color: "#000000"}} to="/home"><b>Home</b></Nav.Link>
              <Nav.Link as={Link} style={{color: "#000000"}} to="/policydashboard"><b>Policies</b></Nav.Link>
              { userIsAuthorized(auth, constants.ADMIN_PERMISSIONS)
                ? 
                  <NavDropdown title={<span><b>Admin</b></span>} id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/announcementmanager">Announcements</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/residencemanager">Community Residences</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/policymanager">Policies</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/usermanager">User Accounts</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/addressmanager">Address Book</NavDropdown.Item>
                  </NavDropdown>
                : ''
              }
            </Nav>
            <div className="fs-6" id="temp-display">
              {`Shiloh, IL: ${ currentTemp ? currentTemp.toFixed(0) : '' }\u00B0 F`}
              {
                weatherIconCode
                ?
                  <img src={getURL_WeatherIcon(weatherIconCode)} alt="weather icon"/>
                : ''
              }
            </div>
            <Nav>
              {
                userIsAuthorized(auth, constants.BASIC_USER_PERMISSIONS)
                ?
                  <Nav.Link as={Link} to="/userprofilemanager"><b>
                    {
                      auth.user.image ?
                        <img src={ auth.user.image } className="me-2 profileimage" width="50" height="50" alt="profile"/>
                                  : ''
                    }
                    { getAuthFirstName(auth) } {' '} { getAuthLastName(auth) }</b>
                  </Nav.Link>
                : ''
              }
              <Nav.Link
                as={Link}
                className="d-flex align-items-center mb-1"
                to="/logout">
                  <b>Logout</b>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    return null;
  }
}

export default NavContainer;