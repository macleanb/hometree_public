describe("Demo-1a-Residence Manager basic functionality and blank fields", () => {
  it("Demo the basic functionality of the Residence Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000).pause();

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences').click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure Residences List is visible */
    /* Ensure the residences banner is visible */
    cy.get('#residencesdisplaycontainer').find('h1').should('have.text', 'Residences');

    /* Ensure the resiences list display contains a search field */
    cy.get("[placeholder='search name, address, email, etc.']").should('exist')

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Attempt to create a new residence with missing street field*/
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#STREET_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    }).pause();

    /* Attempt to create a new residence with missing city field*/
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Blvd.");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure appropriate warnings are displayed */
    cy.get("#CITY_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    }).pause();

    /* Attempt to create a new residence with missing state field*/
    cy.get("[placeholder='Enter City']").type("Shilox");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure appropriate warnings are displayed */
    cy.get("#ADDR_STATE_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    }).pause();

    /* Attempt to create a new residence with missing zipcode field*/
    cy.get("[placeholder='Enter State']").type("IZ");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure appropriate warnings are displayed */
    cy.get("#ZIPCODE_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    }).pause();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get("[placeholder='Enter Zip']").type("62267");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error messages */
    cy.get(".modal-body")
      .should("have.text", "Street: check input (suggest 104 Eden Park Boulevard)").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Type corrected street */
    cy.get("[placeholder='Enter Street']").clear();
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Boulevard");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error messages */
    cy.get(".modal-body")
      .should("have.text", "City: check input (suggest Shiloh)").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Type corrected city */
    cy.get("[placeholder='Enter City']").clear();
    cy.get("[placeholder='Enter City']").type("Shiloh");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error messages */
    cy.get(".modal-body").should("have.text", "State: must fixZipcode: must fix").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Type corrected state */
    cy.get("[placeholder='Enter State']").clear();
    cy.get("[placeholder='Enter State']").type("IL");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error messages */
    cy.get(".modal-body").should("have.text", "Zip Code: check input (suggest 62269)").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Type corrected zip */
    cy.get("[placeholder='Enter Zip']").clear();
    cy.get("[placeholder='Enter Zip']").type("62269");
    cy.get('input[type=file]').selectFile('104.jpeg');
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Residence added successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000).pause();

    /* Search for a residence by street number */
    cy.get("[placeholder='search name, address, email, etc.']").type('104').pause();

    /* Click the button for 100 Eden Park */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button')
      .contains('104 Eden Park').click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Click the button to add an owner */
    cy.get('.ownerinputbutton').click();

    /* Wait for page to update */
    cy.wait(1000).pause();

    /* Search for user by name */
    cy.get("[placeholder='search name, address, email, etc.']").type('ada').pause();

    /* Select the user */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .contains('Lovelace, Adaaaaa')
      .click();

    /* Wait for page to update */
    cy.wait(1000).pause();

    /* Click button to update residence */
    cy.get('#button-update')
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Residence updated successfully (along with owners).").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});