describe("8d4-Policy Manager CRUD", () => {
  it("Test the delete function of the Policy Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Click on the Admin dropdown -> Policies */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Policies')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 7);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'New Policy');

    /* Delete a policy */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .contains('Blue fences are allowed:')
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'Update or Delete Policy');

    cy.get('.formcontainer')
      .contains('Update or Delete Policy')
      .get('button')
      .contains('Delete Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy deleted successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 6);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
