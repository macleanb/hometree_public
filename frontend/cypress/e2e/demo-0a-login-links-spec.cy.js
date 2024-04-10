describe("demo-0a: Login behavior and expolore basic user links", () => {
  it("Demo the basic functionality of the NavContainer component: ensure all links work", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('ada@email.com');
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("div button").should("have.text", "Sign In").click();
 
    /* Wait for page load */
    cy.wait(1000);

    /* Ensure profile link has correct text */
    cy.get("[href='/userprofilemanager']").should("have.text", "Ada   Lovelace");

    /* Ensure temperature display exists */
    cy.get("#temp-display").contains("Shiloh, IL:").pause();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure the map banner is visible */
    cy.get('#map-display-static').find('h1').should('have.text', 'Community Map');

    /* Ensure the map is visible */
    cy.get("[alt='a google map']").should('exist');

    /* Ensure the announcements banner is visible */
    cy.get('#announcementsdisplaycontainer').find('h1').should('have.text', 'Announcements');

    /* Ensure the announcement display tile is visible */
    cy.get('#announcementsdisplaycontainer').find('.announcementsdisplaytile').should('exist');

    /* Ensure search field works */
    cy.get("[placeholder='search announcements...']").type('beer');
    cy.get('.announcementsdisplaytile').get('.cardbody').should('have.length', 1).pause();

    /* Click on the Policies link */
    cy.get("[href='/policydashboard']").should("have.text", "Policies").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000).pause();

    /* Click profile link */
    cy.get("[href='/userprofilemanager']").click();

    /* Wait for page load */
    cy.wait(1000).pause();

    /* Get button for adding an address ("Yes") */
    cy.get("#button-yes").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure the Address Information banner is displayed */
    cy.get("h1").should('have.text', 'New Mailing Address Information');

    /* Enter invalid address information */
    cy.get("[placeholder='Enter Street']").type('30802 S. Coast Hwy.');
    cy.get("[placeholder='Additional Street Info.']").type('SPC Z1');
    cy.get("[placeholder='Enter City']").type('Laguna Zeach');
    cy.get("[placeholder='Enter State']").type('CA');
    cy.get("[placeholder='Enter Zip']").type('92651');

    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body")
      .should("have.text", "Street: check input (suggest 30802 South Coast Highway)").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the Street input */
    cy.get("[placeholder='Enter Street']").clear();
    cy.get("[placeholder='Enter Street']").type('30802 South Coast Highway');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body").should("have.text", "Street (2): must fixCity: must fix").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the City input */
    cy.get("[placeholder='Enter City']").clear();
    cy.get("[placeholder='Enter City']").type('Laguna Beach');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body").should("have.text", "Street (2): must fix").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();
    
    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the Street (2) input */
    cy.get("[placeholder='Additional Street Info.']").clear();
    cy.get("[placeholder='Additional Street Info.']").type('SPC A1');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "User updated successfully.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click away from the user profile page (Home) */
    cy.get("#link-home").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click on user profile link again */
    cy.get("[href='/userprofilemanager']").should("have.text", "Ada   Lovelace").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure all user fields are populated correctly */
    cy.get("[placeholder='Enter e-mail address']").should('have.value', 'ada@email.com').pause();
    cy.get("[placeholder='Enter password']").should('have.value', '');
    cy.get("[placeholder='Enter first name']").should('have.value', 'Ada');
    cy.get("[placeholder='Enter last name']").should('have.value', 'Lovelace');

    /* Click the update address button */
    cy.get("#button-address-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure all address fields are populated correctly */
    cy.get("[placeholder='Enter Street']").should('have.value', '30802 South Coast Highway').pause();
    cy.get("[placeholder='Additional Street Info.']").should('have.value', 'SPC A1');
    cy.get("[placeholder='Enter City']").should('have.value', 'Laguna Beach');
    cy.get("[placeholder='Enter State']").should('have.value', 'CA');
    cy.get("[placeholder='Enter Zip']").should('have.value', '92651');

    /* Update mailing address */
    cy.get("[placeholder='Additional Street Info.']").clear();
    cy.get("[placeholder='Additional Street Info.']").type('SPC B1').pause();
    cy.get("#button-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "Address updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Update user profile (first name) */
    cy.get("[placeholder='Enter first name']").clear();
    cy.get("[placeholder='Enter first name']").type('Adaaaaa').pause();

    /* Click the update user button */
    cy.get("#button-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click on user profile link again */
    cy.get("[href='/userprofilemanager']")
      .should("have.text", "Adaaaaa   Lovelace")
      .pause()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "User updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure user fields are populated correctly */
    cy.get("[placeholder='Enter first name']").should('have.value', 'Adaaaaa');
    cy.get("[placeholder='Enter last name']").should('have.value', 'Lovelace').pause();

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
