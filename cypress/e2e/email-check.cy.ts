describe('Email Check Functionality', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('Should show loading spinner while checking email', () => {
    cy.mockEmailCheckAvailable();
    
    cy.get('[data-testid="email"]').type('new@example.com');
    
    // Should show loader while checking
    cy.get('[data-testid="email"]').parent().find('.animate-spin').should('be.visible');
    
    cy.wait('@emailCheckRequest');
    
    // Loader should disappear after check
    cy.get('[data-testid="email"]').parent().find('.animate-spin').should('not.exist');
    
    // Should show success message
    cy.contains('✓ Email is available').should('be.visible');
  });

  it('Should show error message when email is taken', () => {
    cy.mockEmailCheckTaken();
    
    cy.get('[data-testid="email"]').type('taken@example.com');
    
    cy.wait('@emailCheckRequest');
    
    // Should show error message
    cy.contains('This email is already registered. Please use a different email.').should('be.visible');
  });

  it('Should not check email for invalid formats', () => {
    cy.get('[data-testid="email"]').type('invalid-email');
    
    // Should not make API call for invalid email
    cy.get('@emailCheckRequest.all').should('have.length', 0);
    
    // Should not show any check result
    cy.get('[data-testid="email"]').parent().siblings().should('not.contain', '✓');
    cy.get('[data-testid="email"]').parent().siblings().should('not.contain', 'already registered');
  });

  it('Should debounce email checks', () => {
    cy.mockEmailCheckAvailable();
    
    // Type multiple characters quickly
    cy.get('[data-testid="email"]').type('test');
    cy.get('[data-testid="email"]').type('@example.com');
    
    // Should only make one API call after debounce period
    cy.wait(1000); // Wait for debounce
    cy.wait('@emailCheckRequest');
    cy.get('@emailCheckRequest.all').should('have.length', 1);
  });
});
