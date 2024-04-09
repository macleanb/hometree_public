describe("2-Header Tests for Admin User", () => {
  it("Test the basic functionality of the NavContainer component: ensure all links work", () => {
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

    /* Click on the Policies link */
    cy.get("[href='/policydashboard']").should("have.text", "Policies").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure Home link works */
    cy.get("#link-home").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click on the Admin dropdown -> Announcements */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Announcements').click();
    cy.get('.formcontainer h1').contains('New Announcement').should('exist');

    /* Click on the Admin dropdown -> Community Residences */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Community Residences').click();
    cy.get('.residenceformcontainer h1').contains('New Residence').should('exist');

    /* Click on the Admin dropdown -> Policies */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Policies').click();
    cy.get('.formcontainer h1').contains('New Policy').should('exist');

    /* Click on the Admin dropdown -> User Accounts */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('User Accounts').click();
    cy.get('.userformcontainer h1').contains('New User Information').should('exist');

    /* Click on the Admin dropdown -> Address Book */
    cy.get('.navbar-nav > .dropdown').should('exist').click();
    cy.get('.navbar-nav > .dropdown').should('exist').get('.dropdown-menu > .dropdown-item').contains('Address Book').click();
    cy.get('.addressformcontainer h1').contains('New Address Information').should('exist');

    /* Ensure profile link has correct text and click on it */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   von Neumann").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure hometree logo link works */
    cy.get("[alt='home tree brandname']").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure profile link has correct text and click on it */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   von Neumann");

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });
});
