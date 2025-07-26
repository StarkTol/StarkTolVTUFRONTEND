describe('Registration Form Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('Should register a new user successfully and redirect to login', () => {
    cy.fixture('users').then((users) => {
      const newUser = users.validUser;

      cy.mockEmailCheckAvailable();
      cy.mockRegisterSuccess();

      cy.fillRegistrationForm(newUser);
      cy.get('[data-testid="submit-registration"]').click();

      cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);

      // Assert the redirection to login page
      cy.url().should('include', '/login');
    });
  });

  it('Should show error if user already exists', () => {
    cy.fixture('users').then((users) => {
      const existingUser = users.existingUser;

      cy.mockRegisterUserExists();

      cy.fillRegistrationForm(existingUser);
      cy.get('[data-testid="submit-registration"]').click();

      cy.wait('@registerRequest').its('response.statusCode').should('eq', 409);

      // Assert error message is displayed
      cy.contains('A user with this email already exists. Please use a different email.').should('be.visible');
    });
  });

  it('Should show validation errors', () => {
    cy.fixture('users').then((users) => {
      const { invalidEmail, invalidPhone, shortPassword, mismatchedPasswords } = users.invalidUsers;

      // Test invalid email
      cy.fillRegistrationForm(invalidEmail);
      cy.get('[data-testid="submit-registration"]').click();
      cy.contains('Please enter a valid email address').should('be.visible');
      
      // Test invalid phone
      cy.fillRegistrationForm(invalidPhone);
      cy.get('[data-testid="submit-registration"]').click();
      cy.contains('Please enter a valid Nigerian phone number').should('be.visible');
      
      // Test short password
      cy.fillRegistrationForm(shortPassword);
      cy.get('[data-testid="submit-registration"]').click();
      cy.contains('Password must be at least 6 characters').should('be.visible');
      
      // Test mismatched passwords
      cy.fillRegistrationForm(mismatchedPasswords);
      cy.get('[data-testid="submit-registration"]').click();
      cy.contains('Passwords do not match').should('be.visible');
    });
  });
});

