/* This form doesn't submit anything on its own, but instead passes
   data outward to a parent controller, through state setter functions
*/
import Button from 'react-bootstrap/Button';
import constants from '../constants';
import Form from 'react-bootstrap/Form';


////////////////
///  Render  ///
////////////////
    
const LoginForm = (
  { 
    formData,
    handleLoginClicked,
    onChange,
    parentRefs,
  }
) => {
  
  ////////////////
  ///  Render  ///
  ////////////////

  return (
    <Form id="login-form">
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor={ constants.AUTH_EMAIL_FIELD_NAME }><b>E-mail</b>
          <Form.Control
            id={ constants.AUTH_EMAIL_FIELD_NAME }
            type="text" 
            placeholder="Enter email" 
            onChange={ onChange }
            value={ formData.email ? formData.email : ''} 
            required
            name="email"
            ref={(c) => {
              if (c) {
                parentRefs.inputEmailRef.current = c;
              }
            }}
            autoComplete="off"
            autoFocus
          />
        </Form.Label>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor={ constants.PASSWORD_FIELD_NAME }><b>Password</b>
          <Form.Control
            id={ constants.PASSWORD_FIELD_NAME }
            type="password" 
            placeholder="Enter password" 
            onChange={ onChange }
            value={ formData.password ? formData.password : '' }
            required
            name="password"
            ref={(c) => {
              if (c) {
                parentRefs.inputPasswordRef.current = c;
              }
            }}
          />
        </Form.Label>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={ handleLoginClicked } controlid="loginsubmitbutton">
        Sign In
      </Button>
    </Form>
  );
}
  
  export default LoginForm;