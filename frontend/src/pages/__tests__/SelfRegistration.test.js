/* NOTE: These tests modify the backend database, so every time
         you run them, you'll have to delete the user created by
         the test on the backend (testuser@email.com, testalanturing@email.com)
         before running the suite again, otherwise the test for creating a new
         account will fail due to the email alreaady existing.
*/

import App from '../../App';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
//import image from './alan.jpeg';

////////////////////////////
/*  Reusable RTL queries  */
////////////////////////////

const acknowledgeButton = async () => {
  return await screen.findByRole('button', {name: 'Acknowledge'});
};

const emailAlreadyExistsMessage = async () => {
  return await screen.findByText(/user with this email address already exists/i);
};

const emailField = async () => {
  return await screen.findByRole('textbox', {
    name: /e\-mail/i
  });
};

const firstNameField = async () => {
  return await screen.findByRole('textbox', {
    name: /first name/i
  });
};

const homeTreeLogo = async () => {
  return await screen.findByRole('img', {
    name: /hometree logo/i
  });
};

const imageField = async () => {
  return await screen.findByLabelText(/image/i);
};

const lastNameField = async () => {
  return await screen.findByRole('textbox', {
    name: /last name/i
  });
};

const loadingPageHeading = async () => {
  return await screen.findByRole('heading', {
    name: /loading page.../i
  });
};

const logoutButton = async () => {
  return await screen.findByRole('button', {name: /logout/i});
};

const mapDisplay = async () => {
  return await screen.findByTestId('map');
};

const mapHeading = async () => {
  return await screen.findByRole('heading', {
    name: /community map/i
  });
};

const newUserHeading = async () => {
  return await screen.findByRole('heading', {
    name: /new user information/i
  });
};

const passwordField = async () => {
  return await screen.findByLabelText(/password/i);
};

const profileImage = async () => {
  return await screen.findByRole('img',
  {name: /profile/i});
};

const profileNameButton = async () => {
  return await screen.findByRole('button', {name: /alan/i});
};

const registerButton = async () => {
  return await screen.findByRole('button',
  {name: /complete registration/i});
};

const signInButton = async () => {
  return await screen.findByRole('button');
}

const signInHeading = async () => {
  return await screen.findByRole('heading', {
    name: /sign in/i
  });
};

const signUpLink = async () => {
  return await screen.findByRole('link', {
    name: /sign up/i
  });
};

const successMessage = async () => {
  return await screen.findByText(/account created successfully/i);
};

/* Reference:  https://stackoverflow.com/questions/55611443/create-file-object-using-file-path */
const getImageFile = async () => {
  const fs = require('fs');
  const data = fs.readFileSync(__dirname + '/alan.jpeg', {encoding: 'base64'});
  const base64 = Buffer.from(data,"base64");
  const arrBuffer = Uint8Array.from(base64).buffer;
  const blob = new Blob([arrBuffer], { type: 'image/jpeg'});
  return new File([blob], 'alan.jpeg', {type: 'image/jpeg'});
};

describe('Self-Registration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await act( async () => {
      render(<App />);
    });
  });

  it('Registration screen navigation after "Sign Up" link clicked, and all major components are displayed"', async () => {
    expect(await loadingPageHeading()).toBeInTheDocument();
    expect(await signInHeading()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      expect(await signUpLink()).toBeInTheDocument();
      await user.click(await signUpLink());
    });

    expect(await emailField()).toBeInTheDocument();
    expect(await passwordField()).toBeInTheDocument();
    expect(await firstNameField()).toBeInTheDocument();
    expect(await lastNameField()).toBeInTheDocument();
    expect(await imageField()).toBeInTheDocument();
    expect(await registerButton()).toBeInTheDocument();
    expect(await newUserHeading()).toBeInTheDocument();
  });

  it('Email input invalid after submit attempt without email', async () => {
    expect(await newUserHeading()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await passwordField()).toBeInTheDocument();
    expect(await firstNameField()).toBeInTheDocument();
    expect(await lastNameField()).toBeInTheDocument();
    expect(await registerButton()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await passwordField(), 'testpassword');
      await user.type(await firstNameField(), 'testfirstname');
      await user.type(await lastNameField(), 'testlastname');
      await user.click(await registerButton());
    });

    expect(await registerButton()).toBeInTheDocument();
    expect((await emailField()).validity.valid).toBe(false);
    expect((await passwordField()).validity.valid).toBe(true);
    expect((await firstNameField()).validity.valid).toBe(true);
    expect((await lastNameField()).validity.valid).toBe(true);
  });

  it('Password input invalid after submit attempt without password', async () => {
    expect(await newUserHeading()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      await user.type(await firstNameField(), 'testfirstname');
      await user.type(await lastNameField(), 'testlastname');
      await user.click(await registerButton());
    });

    expect(await registerButton()).toBeInTheDocument();
    expect((await emailField()).validity.valid).toBe(true);
    expect((await passwordField()).validity.valid).toBe(false);
    expect((await firstNameField()).validity.valid).toBe(true);
    expect((await lastNameField()).validity.valid).toBe(true);
  });

  it('First name input invalid after submit attempt without first name', async () => {
    expect(await newUserHeading()).toBeInTheDocument();
    expect((await firstNameField()).value).toBe('');

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      await user.type(await passwordField(), 'testpassword');
      await user.type(await lastNameField(), 'testlastname');
      await user.click(await registerButton());
    });

    expect(await registerButton()).toBeInTheDocument();
    expect((await emailField()).validity.valid).toBe(true);
    expect((await passwordField()).validity.valid).toBe(true);
    expect((await firstNameField()).validity.valid).toBe(false);
    expect((await lastNameField()).validity.valid).toBe(true);
  });

  it('Last name input invalid after submit attempt without last name', async () => {
    expect(await newUserHeading()).toBeInTheDocument();
    expect((await lastNameField()).value).toBe('');

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      await user.type(await passwordField(), 'testpassword');
      await user.type(await firstNameField(), 'testfirstname');
      await user.click(await registerButton());
    });

    expect(await registerButton()).toBeInTheDocument();
    expect((await emailField()).validity.valid).toBe(true);
    expect((await passwordField()).validity.valid).toBe(true);
    expect((await firstNameField()).validity.valid).toBe(true);
    expect((await lastNameField()).validity.valid).toBe(false);
  });

  it('Successful user creation, closing success Modal with click', async () => {
    expect(await newUserHeading()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await registerButton()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      await user.type(await passwordField(), 'testpassword');
      await user.type(await firstNameField(), 'testfirstname');
      await user.type(await lastNameField(), 'testlastname');
      await user.click(await registerButton());
    });

    expect(await successMessage()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.click(await acknowledgeButton());
    });

    /* Should have returned to the login screen */
    expect(await signInHeading()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();
  });

  it('Displays error if account creation attempted with existing email', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.click(await signUpLink());
    });

    expect(await newUserHeading()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await registerButton()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      await user.type(await passwordField(), 'testpassword');
      await user.type(await firstNameField(), 'testfirstname');
      await user.type(await lastNameField(), 'testlastname');
      await user.click(await registerButton());
    });

    expect(await emailAlreadyExistsMessage()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.click(await acknowledgeButton());
    });

    expect(await newUserHeading()).toBeInTheDocument();
  });

  it('Successful user creation with image file, closing success Modal with enter key', async () => {
    /* Reference:
      https://stackoverflow.com/questions/61104842/react-testing-library-how-to-simulate-file-upload-to-a-input-type-file-e
    */
    expect(await newUserHeading()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await registerButton()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testalanturing@email.com');
      await user.type(await passwordField(), 'testpassword');
      await user.type(await firstNameField(), 'Alan');
      await user.type(await lastNameField(), 'Turing');

      const file = await getImageFile();
      await user.upload(await imageField(), file);

      expect((await imageField()).files[0]).toStrictEqual(file)
      expect((await imageField()).files.item(0)).toStrictEqual(file)
      expect((await imageField()).files).toHaveLength(1)

      await user.click(await registerButton());
    });

    expect(await successMessage()).toBeInTheDocument();

    /* Press enter key to close Modal */
    await act( async () => {
      const user = userEvent.setup();
      //await user.click(await acknowledgeButton());
      await user.type(await acknowledgeButton(), "{enter}");
    });

    /* Should have returned to the login screen */
    expect(await signInHeading()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    /* Try to login and see if the image is there. */
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect((await emailField()).value).toBe('');
    expect(await passwordField()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    /* Try to sign in */
    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), "testalanturing@email.com");
      await user.type(await passwordField(), "testpassword");
      await user.click(await signInButton());
    });

    /* Make sure profile elements are displayed on home screen */
    expect(await mapHeading()).toBeInTheDocument();
    expect(await mapDisplay()).toBeInTheDocument();
    expect(await profileImage()).toBeInTheDocument();
    expect((await profileImage()).src).toMatch(/alan/i);
    expect(await profileNameButton()).toBeInTheDocument();
    expect(await logoutButton()).toBeInTheDocument();

    /* Logout */
    await act( async () => {
      const user = userEvent.setup();
      await user.click(await logoutButton());
    });

    expect(await signInHeading()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();
  });
});
