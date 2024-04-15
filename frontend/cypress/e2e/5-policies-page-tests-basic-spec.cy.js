describe("5-Policies Page Tests for Basic User", () => {
  it("Test the basic functionality of the Policies Page", () => {
    cy.visit("/");

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('johnb@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Ensure profile link has correct text */
    cy.get("[href='/userprofilemanager']").should("have.text", "John   Backus");

    /* Ensure temperature display exists */
    cy.get("#temp-display").contains("Shiloh, IL:");

    /* Wait for page load */
    cy.wait(1000);

    /* Click on the Policies link */
    cy.get("[href='/policydashboard']").should("have.text", "Policies").click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the policies display list banner is visible */
    cy.get('#policiesdisplaycontainer').find('h1').should('have.text', 'Policies');

    /* Ensure the policies display contains a search field */
    cy.get("[placeholder='search policies...']").should('exist')

    /* Ensure the policies display tile is visible */
    cy.get('.policiesdisplaytile').should('exist');

    /* Ensure the policies display contains six policies */
    cy.get('.policiesdisplaytile').get('.policy-list-card').should('have.length', 6);

    /* Ensure search field works */
    cy.get("[placeholder='search policies...']").type('trashcans');
    cy.get('.policiesdisplaytile').get('.policy-list-card').should('have.length', 1);
    
    /* Ensure the policy choices banner is visible */
    cy.get('.residencepolicychoicescontainer').find('h1').should('have.text', 'Policy Choices (by residence)');

    /* Ensure selecting a policy changes the displayed policy */
    cy.get("[placeholder='search policies...']").clear();
    cy.get('.policiesdisplaytile').get('.policy-list-card').contains('The HOA President is:').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.residencepolicychoicescontainer').find('h2')
      .should('have.text', 'Who should be the HOA President?');
    cy.get('.residencepolicychoicescontainer').find('h3')
      .should('have.text', 'Rick (50% of votes)');

    /* Ensure the correct number of residence policy choices displayed */
    cy.get('.residencepolicychoicescontainer').get('.policychoicecard').should('have.length', 4);

    /* Ensure a change in policy choice updates the current policy */
    cy.get('.policychoicecard').contains('108 Eden Park Boulevard:').get('select').select('Pikachu');
    cy.get('.policychoicecard').contains('108 Eden Park Boulevard:')
      .get('button').contains('Update Policy Choice').click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy choice updated.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the updated policy is displayed */
    cy.get('.residencepolicychoicescontainer').find('h3')
      .should('have.text', 'N/A - votes are tied or non-existent (50% of votes)');

    cy.get('.policychoicecard').contains('108 Eden Park Boulevard:').get('select').select('Morty');
    cy.get('.policychoicecard').contains('108 Eden Park Boulevard:')
      .get('button').contains('Update Policy Choice').click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "Policy choice updated.");
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 1).first().click();

    /* Wait for page load */
    cy.wait(1000);

    /* Ensure the updated policy is displayed */
    cy.get('.residencepolicychoicescontainer').find('h3')
      .should('have.text', 'Rick (50% of votes)');

    /* Click on a different policy and ensure the correct options load */
    cy.get('.policiesdisplaytile')
      .get('.policy-list-card')
      .contains('Cars must be parked in garages overnight:')
      .click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.residencepolicychoicescontainer').find('h2')
      .should('have.text', "Should residents' cars be parked only in garages overnight?");

    cy.get('.optioninputselect').first().get('option')
      .should('have.length', 3)
      .first()
      .should('have.text', 'No option selected');

    cy.get('.optioninputselect').first().get('option')
      .eq(1)
      .should('have.text', 'Yes');

    cy.get('.optioninputselect').first().get('option')
      .eq(2)
      .should('have.text', 'No');

    /* Click back to the original policy to ensure all policy options load correctly */
    cy.get('.policiesdisplaytile').get('.policy-list-card').contains('The HOA President is:').click();

    /* Wait for page load */
    cy.wait(1000);

    cy.get('.optioninputselect').first().get('option')
      .should('have.length', 3)
      .first()
      .should('have.text', 'Rick');

    cy.get('.optioninputselect').first().get('option')
      .eq(1)
      .should('have.text', 'Morty');

    cy.get('.optioninputselect').first().get('option')
      .eq(2)
      .should('have.text', 'Pikachu');

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */
    cy.wait(1000);
    
    cy.get("div h1").should("have.text", "Sign In");
  });
});
