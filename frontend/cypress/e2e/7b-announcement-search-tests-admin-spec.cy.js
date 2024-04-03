describe("7b-Announcement Search Tests for Admin User", () => {
  it("Test the search functionality of the Announcement Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Announcements */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Announcements')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the announcements display contains a search field */
    cy.get("[placeholder='search announcements...']").should('exist');

    /* Ensure the announcement list displays three announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile')
      .should('exist');
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 3);

    /* Search for an announcement */
    cy.get("[placeholder='search announcements...']").type('car');

    /* Ensure the announcement list displays one announcement button */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', 'Parking violationsJan 10, 2024');

    /* Clear announcement search field */
    cy.get("[placeholder='search announcements...']").clear();

    /* Ensure the announcement list displays three announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 3);

    /* Search for an announcement */
    cy.get("[placeholder='search announcements...']").type('Jan 8, 2024');

    /* Ensure the announcement list displays one announcement button */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 1)
      .first()
      .should('have.text', 'Annual Beerfest!Jan 8, 2024');

    /* Clear announcement search field */
    cy.get("[placeholder='search announcements...']").clear();

    /* Ensure the announcement list displays three announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 3);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
