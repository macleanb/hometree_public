/* External Imports */
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
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
import styles from './NavContainer.module.css';


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
        {/* <Container className="ms-1 me-3 mw-100 w-100"> */}
        <Container fluid>
          <div className="d-flex">
            <img className={styles.toggleable_img} src={ logo } width={50} height={40} alt="tree silhouette logo"></img>
            <Navbar.Brand className="d-flex ms-2 p-0 flex-column">
              <Nav.Link as={Link} to="/home">
                <img className={styles.brand_size} src={ brand } alt="home tree brandname"></img>
              </Nav.Link>
            </Navbar.Brand>
          </div>
          <div className={styles.weather} id="temp-display">
            <span className="pb-2">{`Shiloh, IL: ${ currentTemp ? currentTemp.toFixed(0) : '' }\u00B0 F`}</span>
            {
              weatherIconCode
              ?
                <img src={getURL_WeatherIcon(weatherIconCode)} alt="weather icon"/>
              : ''
            }
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Offcanvas className="flex-grow-0" id="basic-navbar-nav" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex justify-content-end">
              <Nav>
                <Nav.Link className="d-flex flex-column justify-content-end align-items-end pe-3" as={Link} id="link-home" style={{color: "#000000"}} to="/home"><b>Home</b></Nav.Link>
                <Nav.Link className="d-flex flex-column justify-content-end align-items-end pe-3" as={Link} style={{color: "#000000"}} to="/policydashboard"><b>Policies</b></Nav.Link>
                { userIsAuthorized(auth, constants.ADMIN_PERMISSIONS)
                  ? 
                    <NavDropdown className="d-flex flex-column justify-content-end align-items-end pe-3" title={<span><b style={{color: "#000000"}} >Admin</b></span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/announcementmanager">Announcements</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/residencemanager">Community Residences</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/policymanager">Policies</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/usermanager">User Accounts</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/addressmanager">Address Book</NavDropdown.Item>
                    </NavDropdown>
                  : ''
                }
                <Nav.Link
                  as={Link}
                  className="d-flex flex-column justify-content-end align-items-end me-3"
                  to="/logout">
                    <b>Logout</b>
                </Nav.Link>
                {
                  userIsAuthorized(auth, constants.BASIC_USER_PERMISSIONS)
                  ?
                    <Nav.Link as={Link} className={`${styles.profile} pe-3`} to="/userprofilemanager">
                      <b>
                        {
                          auth.user.image ?
                            <img src={ auth.user.image } className="me-2 profileimage" width="50" height="50" alt="profile"/>
                                      : ''
                        }
                        { getAuthFirstName(auth) } {' '} { getAuthLastName(auth) }
                      </b>
                    </Nav.Link>
                  : ''
                }
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  } else {
    return null;
  }
}

export default NavContainer;