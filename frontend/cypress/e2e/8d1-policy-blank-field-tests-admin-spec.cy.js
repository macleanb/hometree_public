describe("8d1-Policy Manager basic functionality and blank fields", () => {
  it("Test the basic functionality of the Policy Manager Page", () => {
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

    cy.get('.formcontainer h1').contains('New Policy').should('exist');

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure Policies List is visible */
    /* Ensure the policies banner is visible */
    cy.get('#policiesdisplaycontainer').find('h1').should('have.text', 'Policies');

    /* Ensure the policies list display contains a search field */
    cy.get("[placeholder='search policies...']").should('exist')

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 6);

    /* Attempt to create a new policy with missing policy field */
    cy.get('.formcontainer')
      .contains('New Policy')
      .get('button')
      .contains('Add Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#POLICY_STATEMENT_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new policy with missing question field */
    cy.get("[placeholder='Enter policy statement...']")
      .type("White fences are allowed.");
    cy.get('.formcontainer')
      .contains('New Policy')
      .get('button')
      .contains('Add Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#POLICY_QUESTION_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
