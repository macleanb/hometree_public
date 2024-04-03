describe("8c-Residence CRUD Tests", () => {
  it("Test Residence create", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Community Residences').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure the correct banner is displayed */
    cy.get('.residenceformcontainer h1')
      .should('have.text', 'New Residence Information');

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Create a residence with valid inputs */
    cy.get("[placeholder='Enter Street']").type("100 Eden Park Boulevard");
    cy.get("[placeholder='Enter City']").type("Shiloh");
    cy.get("[placeholder='Enter State']").type("IL");
    cy.get("[placeholder='Enter Zip']").type("62269");
    cy.get('.residenceformcontainer').contains('New Residence Information').get('button').contains('Add Residence').click();

    /* Wait for page to load */
    cy.wait(2000)

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Residence added successfully.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait for page to update */
    cy.wait(1000)

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 15);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});