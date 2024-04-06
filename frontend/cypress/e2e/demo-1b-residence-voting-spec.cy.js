describe("demo-1d: Residence voting", () => {
  it("Demo the basic functionality of the basic user policies page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('ada@email.com');
    cy.get("[placeholder='Enter password']").type('testpassword');
    cy.get("div button").should("have.text", "Sign In").click();
 
    /* Wait for page load */
    cy.wait(1000).pause();

    /* Click on the Policies link */
    cy.get("[href='/policydashboard']").should("have.text", "Policies").click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000).pause();

    /* Vote no on storing trashcans outside */
    cy.get('.optioninputselect')
      .select('No');
    cy.get('.updatepolicychoicebutton')
      .click();

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Policy choice updated.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000).pause();

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
