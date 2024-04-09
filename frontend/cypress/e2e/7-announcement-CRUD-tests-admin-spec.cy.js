describe("7-Announcement CRUD Tests for Admin User", () => {
  it("Test the basic functionality of the Announcement Manager Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure profile link has correct text */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   von Neumann");

    /* Ensure temperature display exists */
    cy.get("#temp-display").contains("Current Temp");

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure the map banner is visible */
    cy.get('#map-display-static').find('h1').should('have.text', 'Community Map');

    /* Ensure the map is visible */
    cy.get("[alt='a google map']").should('exist');

    /* Ensure the announcements banner is visible */
    cy.get('#announcementsdisplaycontainer')
      .find('h1')
      .should('have.text', 'Announcements');

    /* Ensure the announcements display contains a search field */
    cy.get("[placeholder='search announcements...']").should('exist')

    /* Ensure the announcement display tile is visible */
    cy.get('#announcementsdisplaycontainer')
      .find('.announcementsdisplaytile').should('exist');

    /* Ensure the announcement displays three announcements */
    cy.get('.announcementsdisplaytile')
      .get('.cardbody')
      .should('have.length', 3);

    /* Ensure search field works */
    cy.get("[placeholder='search announcements...']").type('parking');
    cy.get('.announcementsdisplaytile').get('.cardbody').should('have.length', 1);

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

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'New Announcement');

    /* Ensure Announcements List is visible */
    /* Ensure the announcements banner is visible */
    cy.get('#announcementsdisplaycontainer')
      .find('h1').should('have.text', 'Announcements');

    /* Ensure the announcements display contains a search field */
    cy.get("[placeholder='search announcements...']").should('exist')

    /* Ensure the announcement list displays three announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile')
      .should('exist');
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 3);

    /* Create a new announcement */
    cy.get("[placeholder='Enter title...']")
      .type("Don't forget to drink your Ovaltine!");
    cy.get("[placeholder='Enter announcement text...']")
      .type("Little Orphan Annie reminds us to drink our Ovaltine.  It is healthy and refreshing!");
    cy.get('.formcontainer')
      .contains('New Announcement')
      .get('button')
      .contains('Add Announcement')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Announcement added successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Ensure the announcement list displays four announcement buttons */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .should('have.length', 4);

    /* Update the new announcement */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .contains('Ovaltine').click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'Update or Delete Announcement');

    cy.get("[placeholder='Enter title...']").clear();
    cy.get("[placeholder='Enter title...']")
      .type("Remember to drink your Ovaltine!");
    cy.get('.formcontainer')
      .get('button')
      .contains('Update Announcement')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Announcement updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

    /* Delete the new announcement */
    cy.get('#announcementsdisplaycontainer .announcementsdisplaytile button')
      .contains('Remember to drink your Ovaltine!')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'Update or Delete Announcement');

    cy.get('.formcontainer')
      .get('button')
      .contains('Delete Announcement')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Announcement deleted successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait a second to let the modal clear */
    cy.wait(1000);

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
