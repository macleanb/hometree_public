describe("8a-Residence Manager basic functionality and blank fields", () => {
  it("Test the basic functionality of the Residence Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

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

    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure Residences List is visible */
    /* Ensure the residences banner is visible */
    cy.get('#residencesdisplaycontainer').find('h1').should('have.text', 'Residences');

    /* Ensure the resiences list display contains a search field */
    cy.get("[placeholder='search name, address, email, etc.']").should('exist')

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 11);

    /* Attempt to create a new residence with missing street field*/
    cy.get('.residenceformcontainer').contains('New Residence Information').get('button').contains('Add Residence').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#STREET_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new residence with missing city field*/
    cy.get("[placeholder='Enter Street']").type("100 Eden Park Blvd.");
    cy.get('.residenceformcontainer').contains('New Residence Information').get('button').contains('Add Residence').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#CITY_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new residence with missing state field*/
    cy.get("[placeholder='Enter City']").type("Shilox");
    cy.get('.residenceformcontainer').contains('New Residence Information').get('button').contains('Add Residence').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#ADDR_STATE_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new residence with missing zipcode field*/
    cy.get("[placeholder='Enter State']").type("IZ");
    cy.get('.residenceformcontainer').contains('New Residence Information').get('button').contains('Add Residence').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#ZIPCODE_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Wait for page to load */
    cy.wait(1000)

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
