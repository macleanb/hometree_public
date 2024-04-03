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
    cy.get("#temp-display").contains("Current Temp").pause();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure the map banner is visible */
    cy.get('#map-display-static').find('h1').should('have.text', 'Community Map');

    /* Ensure the map is visible */
    cy.get("[alt='a google map']").should('exist').pause();

    /* Ensure the announcements banner is visible */
    cy.get('#announcementsdisplaycontainer').find('h1').should('have.text', 'Announcements');

    /* Ensure the announcement display tile is visible */
    cy.get('#announcementsdisplaycontainer').find('.announcementsdisplaytile').should('exist');

    /* Ensure search field works */
    cy.get("[placeholder='search announcements...']").type('parking');
    cy.get('.announcementsdisplaytile').get('.cardbody').should('have.length', 1).pause();

    /* Click on the Policies link */
    cy.get("[href='/policydashboard']").should("have.text", "Policies").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);


    /* Click profile link */
    cy.get("[href='/userprofilemanager']").click();

    /* Wait for page load */
    cy.wait(1000);




    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
