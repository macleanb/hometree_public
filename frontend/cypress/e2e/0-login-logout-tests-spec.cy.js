describe("0-Login and Logout Tests", () => {
  it("Test the basic functionality of the Login page: logging in and logging out", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Enter valid user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('italo@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure input fields have expected text */
    cy.get("[href='/userprofilemanager']").should("have.text", "Italo   Ferriera");

    /* Wait a second to let all the API data arrive */
    cy.wait(1000);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();
    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Test login attempt with no email or password", () => {
    cy.visit("/");
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure both user inputs are marked invalid */
    cy.get('input:invalid').should('have.length', 2);

    /* Ensure appropriate warnings are displayed */
    cy.get("#AUTH_EMAIL_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('missing email')
    });

    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });

    /* Ensure the Sign In component is still displayed */
    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Test login attempt with valid email but no password", () => {
    cy.visit("/");

    /* Provide valid email but no password */
    cy.get("[placeholder='Enter email']").type('italo@email.com');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure one input is valid and the other is invalid */
    cy.get('input:valid').should('have.length', 1);
    cy.get('input:invalid').should('have.length', 1);

    /* Ensure appropriate warnings are displayed */
    cy.get("#PASSWORD_FIELD").then(($input) => {
      expect($input[0].validationMessage).to.eq('missing password')
    });

    /* Ensure the Sign In component is still displayed */
    cy.get("div h1").should("have.text", "Sign In");
  });

  it("Test login attempt with invalid email and valid password", () => {
    cy.visit("/");

    /* Enter complete but invalid user credentials and click Sign In button */
    cy.get("[placeholder='Enter email']").type('italo');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure a modal is displayed with appropriate warning */
    cy.get(".modal-body").should("have.text", "Error: Invalid email or password");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 0);
    cy.get("div h1").should("have.text", "Sign In");
  });
});
