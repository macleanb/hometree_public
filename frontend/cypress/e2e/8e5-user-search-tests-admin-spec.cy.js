describe("8e5-User Search Tests for Admin User", () => {
  it("Test the search functionality of the User Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click on the Admin dropdown -> User Accounts */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('User Accounts')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the users display contains a search field */
    cy.get("[placeholder='search name, address, email, etc.']").should('exist');

    /* Ensure the users list displays correct number of buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile')
      .should('exist');
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Search for a user by last name */
    cy.get("[placeholder='search name, address, email, etc.']").type('franklin');

    /* Ensure the users list displays one user button */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', 'Franklin, Benjaminbenfranklin@email.com');

    /* Clear users search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the users list displays correct number of buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Search for a user by residence address */
    cy.get("[placeholder='search name, address, email, etc.']").type('117');

    /* Ensure the user list displays one user button */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', 'Franklin, Benjaminbenfranklin@email.com');

    /* Clear users search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the users list displays correct number of buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Search for a user by mailing address */
    cy.get("[placeholder='search name, address, email, etc.']").type('Laguna Beach');

    /* Ensure the users list displays one user button */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 2)
      .first()
      .should('have.text', 'Babbage, Charleschuck@email.com');

    /* Clear users search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the users list displays correct number of buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
