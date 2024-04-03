describe("8e1-User Manager basic functionality and blank fields", () => {
  it("Test the basic functionality of the User Manager Page", () => {
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

    cy.get('.userformcontainer h1').contains('New User Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure Users List is visible */
    /* Ensure the users banner is visible */
    cy.get('#usersdisplaycontainer').find('h1').should('have.text', 'Users List');

    /* Ensure the users list display contains a search field */
    cy.get("[placeholder='search name, address, email, etc.']").should('exist')

    /* Ensure the correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Attempt to create a new user with missing email field */
    cy.get('.userformcontainer')
      .get('button')
      .contains('Add User')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('E-mail is missing or improperly formatted (must be between 8 and 150 characters).')
    });

    /* Attempt to create a new user with missing password field */
    cy.get("[placeholder='Enter e-mail address']")
      .type("ada@email.com");
    cy.get('.userformcontainer')
      .get('button')
      .contains('Add User')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new user with missing first name field */
    cy.get("[placeholder='Enter password']")
      .type("testpassword");
    cy.get('.userformcontainer')
      .get('button')
      .contains('Add User')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#FIRST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
      .to.eq('First name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

    /* Attempt to create a new user with missing last name field */
    cy.get("[placeholder='Enter first name']")
      .type("Ada");
    cy.get('.userformcontainer')
      .get('button')
      .contains('Add User')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#LAST_NAME_FIELD").then(($input) => {
      expect($input[0].validationMessage)
        .to.eq('Last name is missing or improperly formatted (must be between 1 and 150 alphabetical characters).')
    });

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
