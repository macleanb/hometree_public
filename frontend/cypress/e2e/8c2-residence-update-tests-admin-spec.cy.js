describe("8c-Residence CRUD Tests", () => {
  it("Test Residence update", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Community Residences').click();
    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 12);

    /* Ensure the correct banner is displayed */
    cy.get('.residenceformcontainer h1')
      .should('have.text', 'New Residence Information');

    /* Click the button for 100 Eden Park */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .contains('100 Eden Park').click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.residenceformcontainer h1')
      .should('have.text', 'Update or Delete Residence');

    /* Update street with valid input */
    cy.get("[placeholder='Enter Street']").clear();
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Boulevard");
    cy.get('.residenceformcontainer').contains('Update or Delete Residence').get('button').contains('Update Residence').click();

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Residence updated successfully.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait for page to update */
    cy.wait(1000)

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 12);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });
});