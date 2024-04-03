import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';


const Error = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }


    return (
        <section id="errorcontainer" className="d-flex flex-column flex-wrap justify-content-center p-1">
          <h1>Error: unable to locate the desired page or resource.</h1>
          <br/>
          <Nav className="m-auto">
              <Nav.Link className="m-auto" onClick={ handleBackClick }>Back</Nav.Link>
          </Nav>
        </section>
      );
};

export default Error;
