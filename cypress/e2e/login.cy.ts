describe('Login Form Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should login successfully and redirect to dashboard', () => {
    cy.fixture('users').then((users) => {
      const loginUser = users.loginUser;

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            user: {
              id: '1',
              email: loginUser.email
            },
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken'
          }
        }
      }).as('loginRequest');

      cy.get('input[name="email"]').type(loginUser.email);
      cy.get('input[name="password"]').type(loginUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

      // Assert the redirection to dashboard
      cy.url().should('include', '/dashboard');
    });
  });

  it('Should show error on login failure', () => {
    cy.fixture('users').then((users) => {
      const invalidLoginUser = users.invalidLoginUser;

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginRequest');

      cy.get('input[name="email"]').type(invalidLoginUser.email);
      cy.get('input[name="password"]').type(invalidLoginUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

      // Assert error message is displayed
      cy.contains('Login failed. Try again.').should('be.visible');
    });
  });

  it('Should store credentials in localStorage when remember me is checked', () => {
    cy.fixture('users').then((users) => {
      const loginUser = users.loginUser;

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            user: {
              id: '1',
              email: loginUser.email
            },
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken'
          }
        }
      }).as('loginRequest');

      cy.get('input[name="email"]').type(loginUser.email);
      cy.get('input[name="password"]').type(loginUser.password);
      cy.get('#remember').check(); // Check remember me
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      // Verify tokens are stored in localStorage (not sessionStorage)
      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.equal('mockAccessToken');
        expect(win.localStorage.getItem('refresh_token')).to.equal('mockRefreshToken');
        expect(win.sessionStorage.getItem('access_token')).to.be.null;
      });
    });
  });

  it('Should store credentials in sessionStorage when remember me is unchecked', () => {
    cy.fixture('users').then((users) => {
      const loginUser = users.loginUser;

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            user: {
              id: '1',
              email: loginUser.email
            },
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken'
          }
        }
      }).as('loginRequest');

      cy.get('input[name="email"]').type(loginUser.email);
      cy.get('input[name="password"]').type(loginUser.password);
      // Don't check remember me (default is unchecked)
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      // Verify tokens are stored in sessionStorage (not localStorage)
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('access_token')).to.equal('mockAccessToken');
        expect(win.sessionStorage.getItem('refresh_token')).to.equal('mockRefreshToken');
        expect(win.localStorage.getItem('access_token')).to.be.null;
      });
    });
  });
});
