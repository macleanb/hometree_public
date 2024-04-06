describe("Demo-0-Self-Registration", () => {
  it("Demo user registration attempt with blank fields", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In").pause();

    /* Click the 'Sign Up' link */
    cy.get("[href='']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information").pause();

    /* Click register button without entering any information */
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure all user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 4).pause();

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

    /* Click register button after entering only email */
    cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
    cy.get("div button")
      .should("have.text", "Complete Registration")
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 3).pause();

    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('Please fill out this field.')
    });

    /* Click register button after entering only email, password */
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("div button")
      .should("have.text", "Complete Registration")
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 2).pause();

    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('Please fill out this field.')
    });

    /* Click register button after entering only email, password, first name */
    cy.get("[placeholder='Enter first name']").type('Ada');
    cy.get("div button")
      .should("have.text", "Complete Registration")
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 1).pause();

    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('Last name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Click register button after entering user information (invalid email) */
    cy.get("[placeholder='Enter e-mail address']").clear();
    cy.get("[placeholder='Enter e-mail address']").type('ada');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait for page load */
    cy.wait(1000).pause();

    /* Ensure appropriate warnings are displayed */
    cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('E-mail is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    /* Click register button after entering user information (invalid password) */
    cy.get("[placeholder='Enter e-mail address']").clear();
    cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
    cy.get("[placeholder='Enter password']").clear();
    cy.get("[placeholder='Enter password']").type('test');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait for page load */
    cy.wait(1000).pause();

    /* Ensure appropriate warnings are displayed */
    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('Password is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    /* Click register button after entering user information (invalid first name) */
    cy.get("[placeholder='Enter password']").clear();
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("[placeholder='Enter first name']").clear();
    cy.get("[placeholder='Enter first name']").type('8');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait for page load */
    cy.wait(1000).pause();

    /* Ensure appropriate warnings are displayed */
    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Click register button after entering user information (invalid first name) */
    cy.get("[placeholder='Enter first name']").clear();
    cy.get("[placeholder='Enter first name']").type('Ada');
    cy.get("[placeholder='Enter last name']").clear();
    cy.get("[placeholder='Enter last name']").type('8');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait for page load */
    cy.wait(1000).pause();

    /* Ensure appropriate warnings are displayed */
    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Last name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Click register button after entering valid user information */
    cy.get("[placeholder='Enter last name']").clear();
    cy.get("[placeholder='Enter last name']").type('Lovelace');

    /* Upload a profile image */
    cy.get('input[type=file]').selectFile('ada.png').pause();
    cy.get("div button").contains("Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Account created successfully.  Please login to complete the registration process.")
      .pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 0);
    cy.get("div h1").should("have.text", "Sign In").pause();

    /* Enter the new user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('ada@email.com');
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure input fields have expected text */
    cy.get("[href='/userprofilemanager']")
      .should("have.text", "Ada   Lovelace").pause();

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });

  // xit("Demo user registration attempt with improperly-formatted email", () => {
  //   cy.visit("/");

  //   /* Make sure Sign In is visible */
  //   cy.get("div h1").should("have.text", "Sign In");

  //   /* Click the 'Sign Up' link */
  //   cy.get("[href='']").should("have.text", "Sign Up").click();

  //   /* Ensure page banner is displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  //   /* Click register button after entering user information (invalid email) */
  //   cy.get("[placeholder='Enter e-mail address']").type('ada');
  //   cy.get("[placeholder='Enter password']").type('testpassword');
  //   cy.get("[placeholder='Enter first name']").type('Ada');
  //   cy.get("[placeholder='Enter last name']").type('Lovelace');
  //   cy.get("div button").should("have.text", "Complete Registration").click();

  //   /* Wait a second to let all the API data arrive */
  //   cy.wait(1000);

  //   /* Ensure all user inputs are marked invalid */
  //   cy.get('input:invalid').should('have.length', 1).pause();

  //   /* Ensure appropriate warnings are displayed */
  //   cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
  //     expect($input[0].validationMessage)
  //       .to.eq('E-mail is missing or improperly formatted (must be between 8 and 150 characters).')
  //   });

  //   /* Ensure user form is still displayed */
  //   cy.get("div h1").should("have.text", "New User Information");
  // });

  // xit("Test user registration attempt with improperly-formatted password", () => {
  //   cy.visit("/");

  //   /* Make sure Sign In is visible */
  //   cy.get("div h1").should("have.text", "Sign In");

  //   /* Click the 'Sign Up' link */
  //   cy.get("[href='']").should("have.text", "Sign Up").click();

  //   /* Ensure page banner is displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  //   /* Click register button after entering user information (invalid password) */
  //   cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
  //   cy.get("[placeholder='Enter password']").type('test');
  //   cy.get("[placeholder='Enter first name']").type('Ada');
  //   cy.get("[placeholder='Enter last name']").type('Lovelace');
  //   cy.get("div button").should("have.text", "Complete Registration").click();

  //   /* Wait a second to let all the API data arrive */
  //   cy.wait(1000);

  //   /* Ensure all user inputs are marked invalid */
  //   cy.get('input:invalid').should('have.length', 1).pause();

  //   /* Ensure appropriate warnings are displayed */
  //   cy.get("#PASSWORD_FIELD").then(($input) => {
  //     expect($input[0].validationMessage)
  //       .to.eq('Password is missing or improperly formatted (must be between 8 and 150 characters).')
  //   });

  //   /* Ensure user form is still displayed */
  //   cy.get("div h1").should("have.text", "New User Information");
  // });

  // xit("Demo user registration attempt with improperly-formatted first name", () => {
  //   cy.visit("/");

  //   /* Make sure Sign In is visible */
  //   cy.get("div h1").should("have.text", "Sign In");

  //   /* Click the 'Sign Up' link */
  //   cy.get("[href='']").should("have.text", "Sign Up").click();

  //   /* Ensure page banner is displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  //   /* Click register button after entering user information (invalid password) */
  //   cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
  //   cy.get("[placeholder='Enter password']").type('testpassword');
  //   cy.get("[placeholder='Enter first name']").type('8');
  //   cy.get("[placeholder='Enter last name']").type('User');
  //   cy.get("div button").should("have.text", "Complete Registration").click();

  //   /* Wait a second to let all the API data arrive */
  //   cy.wait(1000);

  //   /* Ensure all user inputs are marked invalid */
  //   cy.get('input:invalid').should('have.length', 1).pause();

  //   /* Ensure appropriate warnings are displayed */
  //   cy.get("#FIRST_NAME_FIELD").then(($input) => {
  //     expect($input[0].validationMessage).to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
  //   });

  //   /* Ensure user form is still displayed */
  //   cy.get("div h1").should("have.text", "New User Information");
  // });

  // xit("Demo user registration attempt with improperly-formatted last name", () => {
  //   cy.visit("/");

  //   /* Make sure Sign In is visible */
  //   cy.get("div h1").should("have.text", "Sign In");

  //   /* Click the 'Sign Up' link */
  //   cy.get("[href='']").should("have.text", "Sign Up").click();

  //   /* Ensure page banner is displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  //   /* Click register button after entering user information (invalid password) */
  //   cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
  //   cy.get("[placeholder='Enter password']").type('testpassword');
  //   cy.get("[placeholder='Enter first name']").type('Ada');
  //   cy.get("[placeholder='Enter last name']").type('8');
  //   cy.get("div button").should("have.text", "Complete Registration").click();

  //   /* Wait a second to let all the API data arrive */
  //   cy.wait(1000);

  //   /* Ensure all user inputs are marked invalid */
  //   cy.get('input:invalid').should('have.length', 1).pause();

  //   /* Ensure appropriate warnings are displayed */
  //   cy.get("#LAST_NAME_FIELD").then(($input) => {
  //     expect($input[0].validationMessage).to.eq('Last name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
  //   });

  //   /* Ensure user form is still displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  // });

  /* This test will create a basic user on the backend named
     Ada Lovelace. */
  // xit("Demo the basic functionality of the Self-Registration page: registering a new user", () => {
  //   cy.visit("/");

  //   /* Make sure Sign In is visible */
  //   cy.get("div h1").should("have.text", "Sign In");

  //   /* Click the 'Sign Up' link */
  //   cy.get("[href='']").should("have.text", "Sign Up").click();

  //   /* Ensure page banner is displayed */
  //   cy.get("div h1").should("have.text", "New User Information");

  //   /* Enter valid user information and click Complete Registration button */
  //   cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
  //   cy.get("[placeholder='Enter password']").type('testpassword');
  //   cy.get("[placeholder='Enter first name']").type('Ada');
  //   cy.get("[placeholder='Enter last name']").type('Lovelace');

  //   /* Upload a profile image */
  //   cy.get('input[type=file]').selectFile('ada.png').pause();
  //   cy.get("div button").contains("Complete Registration").click();

  //   /* Wait a second to let all the API data arrive */
  //   cy.wait(1000);

  //   /* Ensure a modal is displayed with appropriate success message */
  //   cy.get(".modal-body")
  //     .should("have.text", "Account created successfully.  Please login to complete the registration process.")
  //     .pause();
  //   cy.get("div button")
  //     .filter(':contains("Acknowledge")')
  //     .should("have.length", 1)
  //     .first()
  //     .click();

  //   /* Wait for page load */
  //   cy.wait(1000);

  //   /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
  //   cy.get("div button")
  //     .filter(':contains("Acknowledge")')
  //     .should("have.length", 0);
  //   cy.get("div h1").should("have.text", "Sign In").pause();

  //   /* Enter the new user information and click Sign In button */
  //   cy.get("[placeholder='Enter email']").type('ada@email.com');
  //   cy.get("[placeholder='Enter password']").type('testpassword');
  //   cy.get("div button").should("have.text", "Sign In").click();

  //   /* Wait for page load */
  //   cy.wait(1000);

  //   /* Ensure input fields have expected text */
  //   cy.get("[href='/userprofilemanager']")
  //     .should("have.text", "Ada   Lovelace").pause();

  //   /* Click logout button and ensure we return to Sign In component */
  //   cy.get("[href='/logout']").should("have.text", "Logout").click();

  //   /* Wait for page load */
  //   cy.wait(1000);

  //   cy.get("div h1").should("have.text", "Sign In");
  // });

  it("Test user attempt to add duplicate user (user email already exists)", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='']").should("have.text", "Sign Up").click();

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Enter valid user information and click Complete Registration button */
    cy.get("[placeholder='Enter e-mail address']").type('ada@email.com');
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("[placeholder='Enter first name']").type('Scooby');
    cy.get("[placeholder='Enter last name']").type('Doo').pause();

    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000).pause();

    /* Ensure a modal is displayed with error message */
    cy.get(".modal-body")
      .should("have.text", "email: hoa user with this email address already exists.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure modal disappears once acknowledge button clicked and user form is still displayed */
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 0);

    cy.get("div h1").should("have.text", "New User Information");
  });
});
