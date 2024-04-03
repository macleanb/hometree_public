describe("7a-Announcement Blank Field Tests for Admin User", () => {
  it("Test the basic functionality of the Announcement Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page load */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Announcements */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Announcements').click();

    /* Wait for page load */
    cy.wait(1000);

    /* Attempt to create a new announcement with blank title field */
    cy.get('.formcontainer').contains('New Announcement').get('button').contains('Add Announcement').click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure appropriate warnings are displayed */
    cy.get("#ANNOUNCEMENT_TITLE_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Attempt to create a new announcement with blank body field (allowed) */
    cy.get("[placeholder='Enter title...']").type("Remember to drink your Ovaltine!");
    cy.get('.formcontainer').contains('New Announcement').get('button').contains('Add Announcement').click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Announcement added successfully.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Delete the new announcement */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button').contains('Remember to drink your Ovaltine!').click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.formcontainer').contains('Update or Delete Announcement').get('button').contains('Delete Announcement').click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Announcement deleted successfully.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the announcement list displays three announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button').should('have.length', 3);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
