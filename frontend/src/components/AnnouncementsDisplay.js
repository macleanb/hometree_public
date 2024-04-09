/* External Imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useEffect, useContext, useRef } from 'react';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { Search } from 'react-bootstrap-icons';

/* Internal Imports */
import AnnouncementCard from './AnnouncementCard';
import AuthContext from '../contexts/AuthProvider';
import constants from '../constants';
import filterAnnouncements from '../utils/announcement/filterAnnouncements';

/* This component takes in announcement data and displays it in 
   sorted order.  It provides a search bar to filter the data
   displayed and sends click events back to the parent component
   to be handled there. */
const AnnouncementsDisplay = (
  {
    announcementsData,
    handleAnnouncementClicked,
    setFrontEndErrors,
    setBackEndErrors,
    setSuccessMessages,
    size
  }) => 
{
  const emptyArray = []
  const [ announcementsDisplayArray, setAnnouncementsDisplayArray] = useState(emptyArray) // all announcements data in array form, sorted
  const { auth } = useContext(AuthContext);
  const searchRef = useRef(null);

  ////////////////////////
  /// Helper Functions ///
  ////////////////////////

  /* Clears all errors and success messages */
  const clearErrorStates = () => {
    setBackEndErrors(null);
    setFrontEndErrors(null);
    setSuccessMessages(null);
  }

  /* Sorts the announcementsArray, most recent on top */
  const setSortedAnnouncementsDisplayArray = (filteredAnnouncements) => {
    if (filteredAnnouncements) {
      filteredAnnouncements.sort(function (a, b) {
        if (a.created_datetime && b.created_datetime) {
          /* Compare the created_datetime */
          return new Date(b.created_datetime) - new Date(a.created_datetime);
        } else {
          return 0;
        }
      });
    
      setAnnouncementsDisplayArray(filteredAnnouncements);
    }
  }

  /* Set announcementsDisplayArray once announcementsData is loaded,
     and any time those states are updated.  Also set the focus to the search bar.  If
     announcementData changes, we don't want this user's AnnouncementsDisplay to just refresh
     and ignore search term filter constraints.  */
  useEffect(() => {
    let search_term = '';

    /* If the search field has any value, update search_term before 
       sorting/filtering */
    if (searchRef?.current?.value) {
      search_term = searchRef.current.value.toUpperCase();
    }

    /* Create arguments for call to filterAnnouncements */
    const announcements = announcementsData?.announcements ? announcementsData.announcements : null;

    if (announcements?.length > 0) {
      setSortedAnnouncementsDisplayArray( 
        filterAnnouncements(announcements, search_term),
      );
    }

    if (searchRef?.current) {
      searchRef.current.focus();
    }
  }, [auth, announcementsData]);


  const handleSearchInputChanged = (event) => {
    const search_term = event.target.value.toUpperCase();

    /* Create arguments for call to filterAnnouncements */
    const announcements = announcementsData?.announcements ? announcementsData.announcements : null;

    /* Filter all announcement entries based on whether the search text is found
        in their announcement data */
    if (announcements?.length > 0) {
      setSortedAnnouncementsDisplayArray(
        filterAnnouncements(announcements, search_term)
      );
    }

    /* Clear the error and success states */
    clearErrorStates();
  }


  if (auth && auth.status && auth.status === constants.STATUS_AUTHENTICATED) {
    if ( size === constants.SIZE_LARGE) {
      return (
        <section id="announcementsdisplaycontainer" className="d-flex flex-column justify-content-center p-0 colorsettings_bodybackground">
          <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Announcements</u></h1>
          {
            announcementsData?.announcements
            ?
              <Form.Group className="d-flex justify-content-center">
                <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_announcementssearchfieldlarge colorsettings_bodybackground">
                  <Search color="royalblue" className="me-2" size={20} />
                  <Form.Control
                    className="rounded-2"
                    placeholder="search announcements..."
                    aria-label="search terms"
                    aria-describedby="basic-addon2"
                    onChange={ handleSearchInputChanged }
                    ref={ searchRef }
                  />
                </InputGroup> 
              </Form.Group>
            : ''
          }
          <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly announcementsdisplaytile colorsettings_bodybackground widthsettings_announcementsdisplaytilelarge">
            {
              announcementsDisplayArray
              ?
                <Col>
                  {announcementsDisplayArray.map((obj, index) => (
                    <Row key={ index } className="mb-5">
                      <AnnouncementCard
                        keyValue={ index }
                        obj={ obj }
                      />
                    </Row>
                  ))}
                </Col>
              : ''
            }
          </div>
        </section>
      );
    } else {
      return (
        <section id="announcementsdisplaycontainer" className="d-flex flex-column justify-content-center p-0 colorsettings_bodybackground heightsettings_announcementsdisplaycontainer">
          {
            announcementsData?.announcements
            ?
              <Form.Group>
                <InputGroup className="ms-3 me-2 mb-2 mt-2 align-items-center justify-content-center widthsettings_announcementssearchfield colorsettings_bodybackground">
                  <Search color="royalblue" className="me-2" size={20} />
                  <Form.Control
                    className="rounded-2"
                    placeholder="search announcements..."
                    aria-label="search terms"
                    aria-describedby="basic-addon2"
                    onChange={ handleSearchInputChanged }
                    ref={ searchRef }
                  />
                </InputGroup> 
              </Form.Group>
            : ''
          }
          <h1 className="colorsettings_bodybackground colorsettings_bodyheaders"><u>Announcements</u></h1>
          <div className="d-flex m-0 p-2 flex-fill flex-wrap justify-content-evenly announcementsdisplaytile colorsettings_bodybackground widthsettings_announcementsdisplaytile">
            <div>
              <ListGroup variant="flush" className="align-items-center justify-content-center">
                {
                  announcementsDisplayArray
                  ?
                    announcementsDisplayArray.map((obj, index) => (
                        <ListGroup.Item className="p-0" key={ index } action onClick={ () => handleAnnouncementClicked(obj) } variant="light">
                          <div key={ index } className="d-flex p-2 flex-wrap justify-content-between colorsettings_bodybackground colorsettings_bodybackgroundhover">
                            <div className="d-flex align-items-center">
                              <img src={ obj.image } width="100" height="100" alt="announcement"/>
                            </div>
                            
                            <div className="d-flex flex-column justify-content-center ms-4">
                              <h5 className="mt-2 mb-1 colorsettings_listtext"><b>{ obj.title }</b></h5>
                              {
                                obj.created_datetime
                                ?
                                  <p align="right" className="mt-1 mb-1 colorsettings_listtext">{ new Date(obj.created_datetime.split('T')[0]).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})  }</p>
                                  : ''
                              }
                            </div>
                          </div>
                        </ListGroup.Item>
                    )) : ''
                }
              </ListGroup>
            </div>
          </div>
        </section>
      );
    }
  } else {
    return (
      <div>Loading page...</div>
    );
  }
}

export default AnnouncementsDisplay;

