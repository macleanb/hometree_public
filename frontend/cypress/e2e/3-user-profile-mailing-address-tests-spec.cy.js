describe("3-User Profile Mailing Address Tests", () => {
  /* This test will create a user on the backend named
     Jack Robinson with email deleteXXXXXX@email.com 
     where each 'X' corresponds to a random integer.
     Otherwise it will return an error for duplicate user 
     every time we run the test email. */
  it("Test the basic functionality of adding an address for a new user", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='']").should("have.text", "Sign Up").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Generate random number for user name.  This is necessary to
       easily allow multiple test runs without violating the rule against
       duplicate e-mails on the backend */
    const randInt = Math.floor(Math.random() * 100000)
    const randEmail = `delete${randInt}@email.com`

    /* Enter valid user information and click Complete Registration button */
    cy.get("[placeholder='Enter e-mail address']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('Jack');
    cy.get("[placeholder='Enter last name']").type('Robinson');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Account created successfully.  Please login to complete the registration process.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 0);
    cy.get("div h1").should("have.text", "Sign In");

    /* Enter the new user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click on user profile link */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jack   Robinson").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Get button for adding an address ("Yes") */
    cy.get("#button-yes").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure the Address Information banner is displayed */
    cy.get("h1").should('have.text', 'New Mailing Address Information');

    /* Enter invalid address information */
    cy.get("[placeholder='Enter Street']").type('30802 S. Coast Hwy.');
    cy.get("[placeholder='Additional Street Info.']").type('SPC Z1');
    cy.get("[placeholder='Enter City']").type('Laguna Zeach');
    cy.get("[placeholder='Enter State']").type('CA');
    cy.get("[placeholder='Enter Zip']").type('92651');

    cy.get("#button-add").click();

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body")
      .should("have.text", "Street: check input (suggest 30802 South Coast Highway)");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the Street input */
    cy.get("[placeholder='Enter Street']").clear();
    cy.get("[placeholder='Enter Street']").type('30802 South Coast Highway');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body").should("have.text", "Street (2): must fixCity: must fix");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the City input */
    cy.get("[placeholder='Enter City']").clear();
    cy.get("[placeholder='Enter City']").type('Laguna Beach');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate error message */
    cy.get(".modal-body").should("have.text", "Street (2): must fix");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();
    
    /* Wait for page load */ 
    cy.wait(1000);

    /* Correct the Street (2) input */
    cy.get("[placeholder='Additional Street Info.']").clear();
    cy.get("[placeholder='Additional Street Info.']").type('SPC A1');
    cy.get("#button-add").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "User updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click away from the user profile page (Home) */
    cy.get("#link-home").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click on user profile link again */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jack   Robinson").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure all user fields are populated correctly */
    cy.get("[placeholder='Enter e-mail address']").should('have.value', randEmail);
    cy.get("[placeholder='Enter password']").should('have.value', '');
    cy.get("[placeholder='Enter first name']").should('have.value', 'Jack');
    cy.get("[placeholder='Enter last name']").should('have.value', 'Robinson');

    /* Click the update address button */
    cy.get("#button-address-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure all address fields are populated correctly */
    cy.get("[placeholder='Enter Street']").should('have.value', '30802 South Coast Highway');
    cy.get("[placeholder='Additional Street Info.']").should('have.value', 'SPC A1');
    cy.get("[placeholder='Enter City']").should('have.value', 'Laguna Beach');
    cy.get("[placeholder='Enter State']").should('have.value', 'CA');
    cy.get("[placeholder='Enter Zip']").should('have.value', '92651');

    /* Update mailing address */
    cy.get("[placeholder='Additional Street Info.']").clear();
    cy.get("[placeholder='Additional Street Info.']").type('SPC B1');
    cy.get("#button-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "Address updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Update user profile (first name) */
    cy.get("[placeholder='Enter first name']").clear();
    cy.get("[placeholder='Enter first name']").type('Jackie');

    /* Click the update user button */
    cy.get("#button-update").click();

    /* Wait for page load */ 
    cy.wait(1000);

   /* Ensure the map banner is visible (should have navigated to Home page) */
   cy.get('#map-display-static').find('h1').should('have.text', 'Community Map');

    /* Click on user profile link again */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jackie   Robinson").click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Ensure user fields are populated correctly */
    cy.get("[placeholder='Enter first name']").should('have.value', 'Jackie');
    cy.get("[placeholder='Enter last name']").should('have.value', 'Robinson');

    /* Ensure a modal is displayed with appropriate successs message */
    cy.get(".modal-body").should("have.text", "User updated successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page load */ 
    cy.wait(1000);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */ 
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });

  /* This test is necessary to delete the user just created */
  it("Test the delete function of the User Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000)

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Click on the Admin dropdown -> User Accounts */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000)

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('User Accounts')
      .click();

    /* Wait for page to load */
    cy.wait(1000)

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 11);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'New User Information');

    /* Delete a user */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .contains('delete')
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'Update or Delete User');

    cy.get('.userformcontainer')
      .get('button')
      .contains('Delete User')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "User deleted successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });

  /* This test will create a user on the backend named
     Jack Robinson with email deleteXXXXXX@email.com 
     where each 'X' corresponds to a random integer.
     Otherwise it will return an error for duplicate user 
     every time we run the test email. */
  it("Test the basic functionality of NOT adding an address for a new user", () => {
    cy.visit("/");

    /* Make sure Sign In is visible */
    cy.get("div h1").should("have.text", "Sign In");

    /* Click the 'Sign Up' link */
    cy.get("[href='']").should("have.text", "Sign Up").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure page banner is displayed */
    cy.get("div h1").should("have.text", "New User Information");

    /* Generate random number for user name.  This is necessary to
        easily allow multiple test runs without violating the rule against
        duplicate e-mails on the backend */
    const randInt = Math.floor(Math.random() * 100000);
    const randEmail = `delete${randInt}@email.com`;

    /* Enter valid user information and click Complete Registration button */
    cy.get("[placeholder='Enter e-mail address']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("[placeholder='Enter first name']").type('Jack');
    cy.get("[placeholder='Enter last name']").type('Robinson');
    cy.get("div button").should("have.text", "Complete Registration").click();

    /* Wait a second to let all the API data arrive */ 
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body")
      .should("have.text", "Account created successfully.  Please login to complete the registration process.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure modal disappears once acknowledge button clicked and Sign In component is displayed */
    cy.get("div button").filter(':contains("Acknowledge")').should("have.length", 0);
    cy.get("div h1").should("have.text", "Sign In");

    /* Enter the new user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type(randEmail);
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on user profile link */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jack   Robinson").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Get button for adding an address ("Skip") */
    cy.get("#button-skip").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'Update User Profile');

    /* Click away from the user profile page (Home) */
    cy.get("#link-home").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on user profile link again */
    cy.get("[href='/userprofilemanager']").should("have.text", "Jack   Robinson").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Get button for adding an address ("Skip") */
    cy.get("#button-skip").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'Update User Profile');

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page load */ 
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
  
  /* This test is necessary to delete the user just created */
  it("Test the delete function of the User Manager Page", () => {
    cy.visit("/");

    /* Wait for page to load */
    cy.wait(1000);

    /* Enter basic user information and click Sign In button */
    cy.get("[placeholder='Enter email']").type('testadmin@email.com');
    cy.get("[placeholder='Enter password']").type('testtest');
    cy.get("div button").should("have.text", "Sign In").click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Click on the Admin dropdown -> User Accounts */
    cy.get('.navbar-nav > .dropdown').should('exist').click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get('.navbar-nav > .dropdown')
      .should('exist')
      .get('.dropdown-menu > .dropdown-item')
      .contains('User Accounts')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 11);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'New User Information');

    /* Delete a user */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .contains('delete')
      .first()
      .click();

    /* Wait for page to update */
    cy.wait(1000);

    /* Ensure the correct banner is displayed */
    cy.get('.userformcontainer h1')
      .should('have.text', 'Update or Delete User');

    cy.get('.userformcontainer')
      .get('button')
      .contains('Delete User')
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure a modal is displayed with appropriate success message */
    cy.get(".modal-body").should("have.text", "User deleted successfully.");
    cy.get("div button")
      .filter(':contains("Acknowledge")')
      .should("have.length", 1)
      .first()
      .click();

    /* Wait for page to load */
    cy.wait(1000);

    /* Ensure the users list displays correct number of user buttons */
    cy.get('#usersdisplaycontainer .usersdisplaytile button')
      .should('have.length', 10);

    /* Click logout button and ensure we return to Sign In component */
    cy.get("[href='/logout']").should("have.text", "Logout").click();

    /* Wait for page to load */
    cy.wait(1000);

    cy.get("div h1").should("have.text", "Sign In");
  });
});
