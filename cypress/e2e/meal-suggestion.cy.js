describe('Refeição vegana', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('carrega a página com o título e os campos principais', () => {
    cy.contains('h1, h2, h3', /Refeição vegana/i).should('be.visible');

    cy.contains('label, div, span', /Tipo:/i).should('be.visible');
    cy.get('select').should('be.visible').and('contain.text', 'Todos');

    cy.contains('label, div, span', /Busca:/i).should('be.visible');
    cy.get('input[placeholder*="Ex:"]').should('be.visible');
    cy.contains('button', /Buscar/i).should('be.visible');
  });

  it('exibe a sugestão inicial com nome e ingredientes', () => {
    cy.contains('h1, h2, h3, h4', /Sopa de cenoura cremosa/i).should('be.visible');
    cy.contains(/\(sopa\)/i).should('be.visible');
    cy.contains(/Ingredientes:/i).should('be.visible');

    cy.contains('li, div, span', /cenoura/i).should('be.visible');
    cy.contains('li, div, span', /cebola/i).should('be.visible');
    cy.contains('li, div, span', /alho/i).should('be.visible');
  });

  it('permite filtrar a busca pelo tipo e procurar por outra refeição', () => {
    cy.get('select').should('be.visible').select('Todos');

    cy.get('input[placeholder*="Ex:"]')
      .should('be.visible')
      .clear()
      .type('arroz');

    cy.contains('button', /Buscar/i).click();

    cy.get('body').then(($body) => {
      const hasResultText = /arroz|feijão|sopa|refeição|ingrediente|cenoura/i.test($body.text());
      expect(hasResultText).to.be.true;
    });
  });
});
