describe("1-Self-Registration Tests", () => {
  /* This test will create a user on the backend named
     Jack Robinson with email deleteXXXXXX@email.com 
     where each 'X' corresponds to a random integer.
     Otherwise it will return an error for duplicate user 
     every time we run the test email. */
  it("Test the basic functionality of the Self-Registration page: registering a new user", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Generate random number for user name.  This is necessary to
       easily allow multiple test runs without violating the rule against
       duplicate e-mails on the backend */
    const randInt = Math.floor(Math.random() * 100000)
    const randEmail = `delete${randInt}@email.com`

    /* Enter valid user information and click Complete Registration button */
    cy.get("[placeholder='Enter e-mail address']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('Jack');
    cy.get("[placeholder='Enter last name']").type('Robinson');

    /* Upload a profile image */
    cy.get('input[type=file]').selectFile('ada.png');
    cy.get("div button").contains("Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Account created successfully.  Please login to complete the registration process.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 0);
    cy.get("div h1").should("have.text", "Sign In");

    /* Enter the new user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure input fields have expected text */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jack   Robinson");

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Test user attempt to add duplicate user (user email already exists)", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Enter valid user information and click Complete Registration button */
    cy.get("[placeholder='Enter e-mail address']").type('jamie@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('Jamie');
    cy.get("[placeholder='Enter last name']").type('Obrien');

    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure a modal is displayed with error message */
    cy.get(".modal-body").should("have.text", "email: hoa user with this email address already exists.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 0);
    cy.get("div h1").should("have.text", "New User Information");
  });

  it("Test user registration attempt with blank fields", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Click register button without entering any information */
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 4);

    /* Ensure appropriate warnings are displayed */
    cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('E-mail is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div h1").should("have.text", "New User Information");
  });

  it("Test user registration attempt with improperly-formatted email", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Click register button after entering user information (invalid email) */
    cy.get("[placeholder='Enter e-mail address']").type('newuser');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('New');
    cy.get("[placeholder='Enter last name']").type('User');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 1);

    /* Ensure appropriate warnings are displayed */
    cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('E-mail is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div h1").should("have.text", "New User Information");
  });

  it("Test user registration attempt with improperly-formatted password", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Click register button after entering user information (invalid password) */
    cy.get("[placeholder='Enter e-mail address']").type('newuser@email.com');
    cy.get("[placeholder='Enter password']").type('test');
    cy.get("[placeholder='Enter first name']").type('New');
    cy.get("[placeholder='Enter last name']").type('User');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 1);

    /* Ensure appropriate warnings are displayed */
    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Password is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div h1").should("have.text", "New User Information");
  });

  it("Test user registration attempt with improperly-formatted first name", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Click register button after entering user information (invalid password) */
    cy.get("[placeholder='Enter e-mail address']").type('newuser@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('8');
    cy.get("[placeholder='Enter last name']").type('User');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 1);

    /* Ensure appropriate warnings are displayed */
    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div h1").should("have.text", "New User Information");
  });

  it("Test user registration attempt with improperly-formatted last name", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='/register']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Click register button after entering user information (invalid password) */
    cy.get("[placeholder='Enter e-mail address']").type('newuser@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('Firstname');
    cy.get("[placeholder='Enter last name']").type('8');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 1);

    /* Ensure appropriate warnings are displayed */
    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Last name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div h1").should("have.text", "New User Information");
  });

  /* This test is necessary to clear the user just created */
  it("Test the delete function of the User Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Click on the Admin dropdown -> User Accounts */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('User Accounts')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 11);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'New User Information');

    /* Delete a user */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .contains('delete')
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'Update or Delete User');

    cy.get('.userformcontainer')
      .get('button')
      .contains('Delete User')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "User deleted successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
