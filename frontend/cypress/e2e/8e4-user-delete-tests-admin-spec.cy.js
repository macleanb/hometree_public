describe("8e4-User Manager CRUD", () => {
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
      .contains('Lovelacetwo, Adatwo')
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
