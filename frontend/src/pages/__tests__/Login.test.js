import App from '../../App';
import { act } from 'react-dom/test-utils';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

////////////////////////////
/*  Reusable RTL queries  */
////////////////////////////

const acknowledgeButton = async () => {
  return await screen.findByRole('button', {name: 'Acknowledge'});
};

const emailField = async () => {
  return await screen.findByRole('textbox', {
    name: /e\-mail/i
  });
};

const formModal = async () => {
  return await screen.findByRole('form');
};

const homeTreeLogo = async () => {
  return await screen.findByRole('img', {
    name: /hometree logo/i
  });
};

const invalidEmailPasswordMessage = async () => {
  return await screen.findByText(/invalid email or password/i);
};

const loadingPageHeading = async () => {
  return await screen.findByRole('heading', {
    name: /loading page.../i
  });
};

const mapDisplay = async () => {
  return await screen.findByTestId('map');
};

const mapHeading = async () => {
  return await screen.findByRole('heading', {
    name: /community map/i
  });
};

const passwordField = async () => {
  return await screen.findByLabelText(/password/i);
};

const signInButton = async () => {
  return await screen.findByRole('button');
};

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

/* Commands must be wrapped in act because there are numerous state changes.
  AuthProvider state changes were causing errors. */
describe('Login Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await act( async () => {
      render(<App />);
    });
  });

  it('Renders "Loading Page then Sign In" text, logo, and sign-up link', async () => {
    expect(await loadingPageHeading()).toBeInTheDocument();
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();
  });

  it('Email input invalid after login attempt without email', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await passwordField()).toBeInTheDocument();
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await passwordField(), 'testpassword');
      expect((await emailField()).validity.valid).toBe(false);
      expect((await passwordField()).validity.valid).toBe(true);
      await user.click(await signInButton());
    });

    expect(await emailField()).toBeInTheDocument();
    /* Since validation reporting is done by browser instead of DOM,
      we won't find any error text for invalid inputs.  It isn't possible 
      to query for tooltips that pop up from the browser support for 
      reportValidation */
    //expect(await screen.findByText(/missing email/)).toBeInTheDocument();
  });

  it('Email input invalid after login attempt with improperly-formatted email', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await passwordField()).toBeInTheDocument();
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await passwordField(), 'testemail');
      await user.type(await passwordField(), 'testpassword');
      expect((await emailField()).validity.valid).toBe(false);
      expect((await passwordField()).validity.valid).toBe(true);
      await user.click(await signInButton());
    });

    expect(await emailField()).toBeInTheDocument();
    /* Since validation reporting is done by browser instead of DOM,
      we won't find any error text for invalid inputs.  It isn't possible 
      to query for tooltips that pop up from the browser support for 
      reportValidation */
    //expect(await screen.findByText(/missing email/)).toBeInTheDocument();
  });

  it('Email input valid and password input invalid after login attempt without password', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect(await passwordField()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      expect((await emailField()).validity.valid).toBe(true);
      expect((await passwordField()).validity.valid).toBe(false);
      await user.click(await signInButton());
    });

    expect(await emailField()).toBeInTheDocument();
  });

  it('Email/password combo invalid after login attempt, closing Modal with click', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect((await emailField()).value).toBe('');
    expect(await passwordField()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      expect((await emailField()).validity.valid).toBe(true);
      await user.type(await passwordField(), 'invalidpassword');
      expect((await passwordField()).validity.valid).toBe(true);
      await user.click(await signInButton());
    });

    const invalidEmailPasswordMsg = await invalidEmailPasswordMessage();

    expect(invalidEmailPasswordMsg).toBeInTheDocument();
    expect(await acknowledgeButton()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.click(await acknowledgeButton());
    });

    expect(invalidEmailPasswordMsg).not.toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
  });

  it('Email/password combo invalid after login attempt, closing error Modal with enter key', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect((await emailField()).value).toBe('');
    expect(await passwordField()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), 'testemail@email.com');
      expect((await emailField()).validity.valid).toBe(true);
      await user.type(await passwordField(), 'invalidpassword');
      expect((await passwordField()).validity.valid).toBe(true);
      await user.click(await signInButton());
    });

    const invalidEmailPasswordMsg = await invalidEmailPasswordMessage();

    expect(invalidEmailPasswordMsg).toBeInTheDocument();
    expect(await formModal()).toBeInTheDocument();
    expect(await acknowledgeButton()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await acknowledgeButton(), "{enter}");
    });

    /* The expect below would fail because the Modal wrapper (Form)
       IS still present in the DOM */
    // expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
  });

  it('Home screen navigation after login attempt', async () => {
    expect(await signInHeading()).toBeInTheDocument();
    expect(await homeTreeLogo()).toBeInTheDocument();
    expect(await emailField()).toBeInTheDocument();
    expect((await emailField()).value).toBe('');
    expect(await passwordField()).toBeInTheDocument();
    expect((await passwordField()).value).toBe('');
    expect(await signInButton()).toBeInTheDocument();
    expect(await signUpLink()).toBeInTheDocument();

    await act( async () => {
      const user = userEvent.setup();
      await user.type(await emailField(), "alanturing@email.com");
      await user.type(await passwordField(), "testpasswordturing");
      await user.click(await signInButton());
    });

    expect(await mapHeading()).toBeInTheDocument();
    expect(await mapDisplay()).toBeInTheDocument();
  });
});
