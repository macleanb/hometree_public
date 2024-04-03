describe("8d5-Policy Search Tests for Admin User", () => {
  it("Test the search functionality of the Policy Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Policies */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Policies')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the policies display contains a search field */
    cy.get("[placeholder='search policies...']").should('exist');

    /* Ensure the policies list displays correct number of buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile')
      .should('exist');
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 6);

    /* Search for a policy by title */
    cy.get("[placeholder='search policies...']").type('disestablish');

    /* Ensure the policies list displays one policy button */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', 'The HOA is disestablished:Jan 12, 2024');

    /* Clear policy search field */
    cy.get("[placeholder='search policies...']").clear();

    /* Ensure the policies list displays correct number of buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 6);

    // /* Search for a policy by Date */
    // cy.get("[placeholder='search policies...']").type('Jan 8');

    // /* Ensure the policies list displays one policy button */
    // cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
    //   .should('have.length', 1)
    //   .first()
    //   .should('have.text', 'Annual Beerfest!Jan 8, 2024');

    // /* Clear policy search field */
    // cy.get("[placeholder='search policies...']").clear();

    // /* Ensure the poicies list displays correct number of buttons */
    // cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
    //   .should('have.length', 6);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
