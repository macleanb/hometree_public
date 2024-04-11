describe("4-Home Page Tests for Basic User", () => {
  it("Test the basic functionality of the Home Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('italo@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure profile link has correct text */
    cy.get("[href='/userprofilemanager']").should("have.text", "Italo   Ferriera");

    /* Ensure temperature display exists */
    cy.get("#temp-display").contains("Shiloh, IL:");

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure the map banner is visible */
    cy.get('#map-display-static').find('h1').should('have.text', 'Community Map');

    /* Ensure the map is visible */
    cy.get("[alt='a google map']").should('exist');

    /* Ensure the announcements banner is visible */
    cy.get('#announcementsdisplaycontainer').find('h1').should('have.text', 'Announcements');

    /* Ensure the announcements display contains a search field */
    cy.get("[placeholder='search announcements...']").should('exist')

    /* Ensure the announcement display tile is visible */
    cy.get('#announcementsdisplaycontainer').find('.col').should('exist');

    /* Ensure the announcement displays three announcements */
    cy.get('.col').get('.cardbody').should('have.length', 3);

    /* Ensure search field works */
    cy.get("[placeholder='search announcements...']").type('parking');
    cy.get('.col').get('.cardbody').should('have.length', 1);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });
});
