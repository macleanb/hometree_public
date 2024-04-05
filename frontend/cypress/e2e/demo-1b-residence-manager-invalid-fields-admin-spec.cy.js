describe("8b-Residence Manager invalid field inputs", () => {
  it("Demo entry of invalid street", () => {
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

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.residenceformcontainer h1')
      .contains('New Residence Information')
      .should('exist');

    /* Wait for page to load */
    cy.wait(1000);

    /* Attempt to create a new residence with invalid street */
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Blvd.");
    cy.get("[placeholder='Enter City']").type("Shiloh");
    cy.get("[placeholder='Enter State']").type("IL");
    cy.get("[placeholder='Enter Zip']").type("62269");
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

    /* Ensure the residences list displays the correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Demo entry of invalid city", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000);

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000);

    /* Attempt to create a new residence with invalid city */
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Boulevard");
    cy.get("[placeholder='Enter City']").type("Shilox");
    cy.get("[placeholder='Enter State']").type("IL");
    cy.get("[placeholder='Enter Zip']").type("62269");
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

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Demo entry of invalid state", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000);

    /* Attempt to create a new residence with invalid state */
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Boulevard");
    cy.get("[placeholder='Enter City']").type("Shiloh");
    cy.get("[placeholder='Enter State']").type("IX");
    cy.get("[placeholder='Enter Zip']").type("62269");
    cy.get('.residenceformcontainer')
      .contains('New Residence Information')
      .get('button')
      .contains('Add Residence')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error messages */
    cy.get(".modal-body").should("have.text", "State: check input (suggest IL)").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Demo entry of invalid zip", () => {
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
    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Community Residences')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.residenceformcontainer h1').contains('New Residence Information').should('exist');

    /* Wait for page to load */
    cy.wait(1000);

    /* Attempt to create a new residence with invalid zip */
    cy.get("[placeholder='Enter Street']").type("104 Eden Park Boulevard");
    cy.get("[placeholder='Enter City']").type("Shiloh");
    cy.get("[placeholder='Enter State']").type("IL");
    cy.get("[placeholder='Enter Zip']").type("62267");
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

    /* Ensure the residences list displays correct number of residence buttons */
    cy.get('#residencesdisplaycontainer .residencesdisplaytile button').should('have.length', 14);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
