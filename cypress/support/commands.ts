/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string): void;
    }
  }
}

Cypress.Commands.add('login', (username: string = 'Jeff Pierce') => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type('password123');
  cy.contains('button', 'Sign In').click();
  cy.url().should('not.include', '/login');
});
