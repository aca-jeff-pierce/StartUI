describe('ACA Agent Portal — Primary Agent Workflow', () => {

  beforeEach(() => {
    cy.login('Jeff Pierce');
  });

  it('should display the Home dashboard after login', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Good morning').should('be.visible');
    cy.contains('Impounds').should('be.visible');
    cy.contains('Settlements').should('be.visible');
  });

  it('should navigate to the Impounds section', () => {
    cy.contains('a', 'Impounds').click();
    cy.url().should('include', '/impounds');
    cy.contains('h1', 'Impounds').should('be.visible');
    cy.contains('ACA-889231').should('be.visible');
  });

  it('should open the detail panel when a record is clicked', () => {
    cy.contains('a', 'Impounds').click();
    cy.contains('ACA-889231').click();
    cy.contains('Record Detail').should('be.visible');
    cy.contains('Marcus Johnson').should('be.visible');
  });

  it('should release an impound and reflect updated status', () => {
    cy.contains('a', 'Impounds').click();
    cy.contains('ACA-889231').click();
    cy.contains('button', 'Release Impound').click();
    cy.contains('Record Detail').should('not.exist');
  });

  it('should navigate to all 6 sections from the sidebar', () => {
    const sections = [
      { label: 'ANT',           url: '/ant' },
      { label: 'Reinstatement', url: '/reinstatement' },
      { label: 'Svc Support',   url: '/svc-support' },
      { label: 'Insurance',     url: '/insurance' },
      { label: 'Settlements',   url: '/settlements' },
    ];

    for (const section of sections) {
      cy.contains('a', section.label).click();
      cy.url().should('include', section.url);
      cy.contains('h1', section.label).should('be.visible');
    }
  });

  it('should collapse and expand the sidebar', () => {
    cy.contains('Impounds').should('be.visible');
    cy.get('button[aria-label="Collapse sidebar"]').click();
    cy.contains('Impounds').should('not.exist');
    cy.get('button[aria-label="Expand sidebar"]').click();
    cy.contains('Impounds').should('be.visible');
  });

});
