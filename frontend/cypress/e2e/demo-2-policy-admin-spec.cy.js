describe("demo-2-Policy Admin", () => {
  it("Demo the CRUD functions of the Policy Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Click on the Admin dropdown -> Policies */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('Policies')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 6);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'New Policy');

    /* Create a new policy with empty description field */
    cy.get("[placeholder='Enter policy statement...']")
      .type("White fences are allowed:");
    cy.get("[placeholder='Enter policy question...']")
      .type("Should white fences be allowed?").pause();

    /* Add 'Yes' option */
    cy.get("[placeholder='Enter option text...']")
      .type("Yes");

    cy.get('.formcontainer')
      .contains('New Policy')
      .get('button')
      .contains('Add Option')
      .click();

    /* Wait for page to load */
    cy.wait(1000).pause();

    /* Add 'No' option */
    cy.get("[placeholder='Enter option text...']")
      .type("No");

    cy.get('.formcontainer')
      .contains('New Policy')
      .get('button')
      .contains('Add Option')
      .click();

    /* Wait for page to load */
    cy.wait(1000).pause();

    cy.get('.formcontainer')
      .contains('New Policy')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .first()
      .contains('Yes');

    cy.get('.formcontainer')
      .contains('New Policy')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .eq(1)
      .contains('No');

    cy.get('.formcontainer')
      .contains('New Policy')
      .get('button')
      .contains('Add Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy added successfully.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 7);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'New Policy');

    /* Update a policy */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .contains('White fences are allowed:')
      .click();

    /* Wait for page to update */
    cy.wait(1000).pause();

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'Update or Delete Policy');

    cy.get("[placeholder='Enter policy statement...']")
      .clear();
    cy.get("[placeholder='Enter policy statement...']")
      .type("Blue fences are allowed:");
    cy.get("[placeholder='Enter policy question...']")
      .clear();
    cy.get("[placeholder='Enter policy question...']")
      .type("Should blue fences be allowed?").pause();

    cy.get('.formcontainer')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .first()
      .contains('Yes');

    cy.get('.formcontainer')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .eq(1)
      .contains('No');

    /* Add 'Maybe so' option */
    cy.get("[placeholder='Enter option text...']")
      .type("Maybe so");

    cy.get('.formcontainer')
      .get('button')
      .contains('Add Option')
      .click();

    /* Wait for page to load */
    cy.wait(1000).pause();

    cy.get('.formcontainer')
      .get('.optioninputselect option')
      .should('have.length', 3)
      .eq(2)
      .contains('Maybe so');

    cy.get('.formcontainer')
      .contains('Update or Delete Policy')
      .get('button')
      .contains('Update Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy updated successfully.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Remove 'Maybe so' option */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .contains('Blue fences are allowed:')
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    cy.get('.formcontainer')
      .get('.optioninputselect')
      .select('Maybe so');

    /* Wait for page to update */
    cy.wait(1000).pause();

    cy.get('.formcontainer')
      .get('button')
      .contains('Remove Option')
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    cy.get('.formcontainer')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .first()
      .contains('Yes');

    cy.get('.formcontainer')
      .get('.optioninputselect option')
      .should('have.length', 2)
      .eq(1)
      .contains('No');

    cy.get('.formcontainer')
      .contains('Update or Delete Policy')
      .get('button')
      .contains('Update Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy updated successfully.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the policies list displays correct number of policy buttons */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .should('have.length', 7);

    /* Delete a policy */
    cy.get('#policiesdisplaycontainer .policiesdisplaytile button')
      .contains('Blue fences are allowed:')
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.formcontainer h1')
      .should('have.text', 'Update or Delete Policy').pause();

    cy.get('.formcontainer')
      .contains('Update or Delete Policy')
      .get('button')
      .contains('Delete Policy')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy deleted successfully.").pause();
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get("div h1").should("have.text", "Sign In");
  });
});
