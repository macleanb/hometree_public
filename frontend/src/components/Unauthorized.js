import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';


const Unauthorized = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }


    return (
        <section id="unauthorizedcontainer" className="d-flex flex-column flex-wrap justify-content-center p-1">
          <h1>You are not authorized to visit that page, sorry.</h1>
          <br/>
          <Nav className="m-auto">
              <Nav.Link className="m-auto" onClick={ handleBackClick }>Back</Nav.Link>
          </Nav>
        </section>
      );
};

export default Unauthorized;
