describe("2-Header Tests for Basic User", () => {
  it("Test the basic functionality of the NavContainer component: ensure all links work", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('johnb@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure profile link has correct text */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   Backus");

    /* Ensure temperature display exists */
    cy.get("#temp-display").contains("Shiloh, IL:");

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

    /* Ensure there is NO Admin dropdown */
    cy.get('.navbar-nav > .dropdown').should('not.exist');

    /* Ensure profile link has correct text and click on it */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   Backus").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure hometree logo link works */
    cy.get("[alt='home tree brandname']").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure profile link has correct text and click on it */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   Backus");

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });
});
