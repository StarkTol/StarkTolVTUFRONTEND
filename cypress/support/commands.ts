/// <reference types="cypress" />

// Custom command to fill registration form
Cypress.Commands.add('fillRegistrationForm', (userdata: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) => {
  cy.get('[data-testid="first_name"]').type(userdata.firstName);
  cy.get('[data-testid="last_name"]').type(userdata.lastName);
  cy.get('[data-testid="email"]').type(userdata.email);
  cy.get('[data-testid="phone"]').type(userdata.phone);
  cy.get('[data-testid="password"]').type(userdata.password);
  cy.get('[data-testid="confirm_password"]').type(userdata.confirmPassword);
  cy.get('[data-testid="agree-terms"]').check();
});

// Custom command to mock API calls
Cypress.Commands.add('mockRegisterSuccess', () => {
  cy.intercept('POST', '/api/auth/register', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    }
  }).as('registerRequest');
});

Cypress.Commands.add('mockRegisterUserExists', () => {
  cy.intercept('POST', '/api/auth/register', {
    statusCode: 409,
    body: {
      success: false,
      message: 'A user with this email already exists. Please use a different email.'
    }
  }).as('registerRequest');
});

Cypress.Commands.add('mockEmailCheckAvailable', () => {
  cy.intercept('GET', '/api/auth/check-email*', {
    statusCode: 200,
    body: {
      available: true
    }
  }).as('emailCheckRequest');
});

Cypress.Commands.add('mockEmailCheckTaken', () => {
  cy.intercept('GET', '/api/auth/check-email*', {
    statusCode: 200,
    body: {
      available: false
    }
  }).as('emailCheckRequest');
});

declare global {
  namespace Cypress {
    interface Chainable {
      fillRegistrationForm(userdata: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
      }): Chainable<void>;
      mockRegisterSuccess(): Chainable<void>;
      mockRegisterUserExists(): Chainable<void>;
      mockEmailCheckAvailable(): Chainable<void>;
      mockEmailCheckTaken(): Chainable<void>;
    }
  }
}
