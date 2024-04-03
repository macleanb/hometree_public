describe("8c4-Residence Search Tests for Admin User", () => {
  it("Test the search functionality of the Residence Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the residences display contains a search field */
    cy.get("[placeholder='search name, address, email, etc.']").should('exist');

    /* Ensure the residences list displays correct number of buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile')
      .should('exist');
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 14);

    /* Search for a residence by owner name */
    cy.get("[placeholder='search name, address, email, etc.']").type('alan');

    /* Ensure the residence list displays one residence button */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', '120 Eden Park BoulevardShiloh, IL 62269');

    /* Clear residence search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the residence list displays correct number of buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 14);

    /* Search for a residence by residence address */
    cy.get("[placeholder='search name, address, email, etc.']").type('120');

    /* Ensure the residence list displays one residence button */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', '120 Eden Park BoulevardShiloh, IL 62269');

    /* Clear residence search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the residence list displays correct number of buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 14);

    /* Search for a residence by user email */
    cy.get("[placeholder='search name, address, email, etc.']").type('alanturing@email.com');

    /* Ensure the residence list displays one residence button */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', '120 Eden Park BoulevardShiloh, IL 62269');

    /* Clear residence search field */
    cy.get("[placeholder='search name, address, email, etc.']").clear();

    /* Ensure the residence list displays correct number of buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .should('have.length', 14);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
