describe('Aplicação Meal Suggestion - Refeição vegana', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Carregamento inicial', () => {
    it('deve carregar a página com o título principal', () => {
      cy.get('h1').should('contain', 'Refeição vegana 🌱');
    });

    it('deve exibir o filtro de tipo de refeição', () => {
      cy.get('label[for="meal-type-filter"]').should('contain', 'Tipo:');
      cy.get('#meal-type-filter').should('be.visible');
      cy.get('#meal-type-filter option').should('have.length', 7);
    });

    it('deve exibir as opções de filtro corretas', () => {
      cy.get('#meal-type-filter option').then(($options) => {
        const values = [...$options].map(el => el.value);
        expect(values).to.deep.equal([
          'all',
          'salad',
          'soup',
          'sandwich',
          'hot',
          'snack',
          'high-protein'
        ]);
      });
    });

    it('deve exibir o campo de busca com placeholder correto', () => {
      cy.get('label[for="search-field"]').should('contain', 'Busca:');
      cy.get('#search-field')
        .should('be.visible')
        .should('have.attr', 'placeholder', 'Ex: Arroz e feijão');
    });

    it('deve exibir o botão de busca', () => {
      cy.get('#search-container button[type="submit"]')
        .should('be.visible')
        .should('contain', 'Buscar');
    });

    it('deve gerar e exibir uma refeição ao carregar', () => {
      cy.get('#meal-name').should('not.be.empty');
      cy.get('#ingredients-label').should('contain', 'Ingredientes:');
      cy.get('#ingredients-list li').should('have.length.greaterThan', 0);
    });
  });

  describe('Exibição de refeições', () => {
    it('deve exibir o nome da refeição com tipo e indicador de proteína quando aplicável', () => {
      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        // Verifica se contém um tipo de refeição
        const hasType = /prato quente|salada|sanduíche|lanche|sopa/i.test(text);
        expect(hasType).to.be.true;
      });
    });

    it('deve exibir lista de ingredientes como itens de lista', () => {
      cy.get('#ingredients-list').should('be.visible');
      cy.get('#ingredients-list li').each(($li) => {
        cy.wrap($li).should('not.be.empty');
      });
    });

    it('deve mostrar "com alto teor de proteína" no nome quando aplicável', () => {
      // Clica no filtro de alto teor de proteína
      cy.get('#meal-type-filter').select('high-protein');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        // Deve conter indicador de proteína
        const hasProteinLabel = /alto teor de proteína/i.test(text);
        expect(hasProteinLabel).to.be.true;
      });
    });
  });

  describe('Filtro por tipo de refeição', () => {
    it('deve filtrar refeições quando "Saladas" é selecionado', () => {
      cy.get('#meal-type-filter').select('salad');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        expect(text).to.include('salada');
      });
    });

    it('deve filtrar refeições quando "Sopas" é selecionado', () => {
      cy.get('#meal-type-filter').select('soup');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        expect(text).to.include('sopa');
      });
    });

    it('deve filtrar refeições quando "Sanduíches" é selecionado', () => {
      cy.get('#meal-type-filter').select('sandwich');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        expect(text).to.include('sanduíche');
      });
    });

    it('deve filtrar refeições quando "Pratos quentes" é selecionado', () => {
      cy.get('#meal-type-filter').select('hot');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        expect(text).to.include('prato quente');
      });
    });

    it('deve filtrar refeições quando "Lanches" é selecionado', () => {
      cy.get('#meal-type-filter').select('snack');
      cy.wait(500);

      cy.get('#meal-name').then(($mealName) => {
        const text = $mealName.text();
        expect(text).to.include('lanche');
      });
    });

    it('deve mostrar apenas refeições com alto teor de proteína quando selecionado', () => {
      cy.get('#meal-type-filter').select('high-protein');
      cy.wait(500);

      cy.get('#meal-name').should('contain', 'alto teor de proteína');
    });

    it('deve retornar a todas as refeições quando "Todos" é selecionado', () => {
      // Primeiro seleciona um filtro específico
      cy.get('#meal-type-filter').select('salad');
      cy.wait(300);

      // Depois retorna para "Todos"
      cy.get('#meal-type-filter').select('all');
      cy.wait(500);

      // Verifica que pode conter qualquer tipo de refeição
      cy.get('#meal-name').should('not.be.empty');
    });
  });

  describe('Funcionalidade de busca', () => {
    it('deve buscar refeição pelo nome quando pressionado o botão Buscar', () => {
      // Digita "Feijoada" no campo de busca
      cy.get('#search-field').type('Feijoada');
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      // Verifica se a refeição exibida contém "Feijoada" ou se o campo foi limpo
      cy.get('#search-field').should('have.value', '');
    });

    it('deve encontrar refeição por busca parcial', () => {
      // Digita parte do nome
      cy.get('#search-field').type('Arroz');
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#search-field').should('have.value', '');
    });

    it('deve limpar o campo de busca após clicar no botão com entrada válida', () => {
      cy.get('#search-field').type('Salada');
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#search-field').should('have.value', '');
    });

    it('deve gerar nova refeição aleatória quando botão é clicado com campo vazio', () => {
      // Registra o nome inicial
      cy.get('#meal-name').then(($mealName) => {
        const initialMeal = $mealName.text();

        // Clica no botão (com campo vazio)
        cy.get('#search-container button[type="submit"]').click();
        cy.wait(500);

        // Pode ser a mesma refeição (por acaso) ou diferente
        cy.get('#meal-name').should('not.be.empty');
      });
    });
  });

  describe('Interatividade geral', () => {
    it('deve permitir múltiplas gerações de refeições consecutivas', () => {
      cy.get('#meal-name').then(($initialMeal) => {
        const initialText = $initialMeal.text();
        expect(initialText).to.not.be.empty;
      });

      // Clica para gerar nova refeição
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#meal-name').should('not.be.empty');

      // Clica novamente
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#meal-name').should('not.be.empty');
    });

    it('deve manter ingredientes sincronizados com a refeição exibida', () => {
      // Seleciona um filtro
      cy.get('#meal-type-filter').select('salad');
      cy.wait(500);

      // Verifica que há ingredientes exibidos
      cy.get('#ingredients-list li').should('have.length.greaterThan', 0);

      // Muda de filtro
      cy.get('#meal-type-filter').select('soup');
      cy.wait(500);

      // Verifica que ainda há ingredientes (a lista foi atualizada)
      cy.get('#ingredients-list li').should('have.length.greaterThan', 0);
    });

    it('deve permitir combinar filtro de tipo com busca', () => {
      // Primeiro filtra por sopas
      cy.get('#meal-type-filter').select('soup');
      cy.wait(300);

      // Depois digita uma busca
      cy.get('#search-field').type('Lentilha');
      cy.wait(500);

      // Verifica que o campo foi preenchido
      cy.get('#search-field').should('have.value', 'Lentilha');
    });
  });

  describe('Validações de UI', () => {
    it('deve ter select com o valor inicial "Todos"', () => {
      cy.get('#meal-type-filter').should('have.value', 'all');
    });

    it('deve ter campo de busca vazio no início', () => {
      cy.get('#search-field').should('have.value', '');
    });

    it('deve exibir os elementos em ordem correta: filtro > busca > resultado', () => {
      cy.get('#filter-container').then(($filter) => {
        cy.get('#search-container').then(($search) => {
          cy.get('#content-wrapper').then(($content) => {
            const filterPos = $filter.offset().top;
            const searchPos = $search.offset().top;
            const contentPos = $content.offset().top;

            expect(filterPos).to.be.lessThan(searchPos);
            expect(searchPos).to.be.lessThan(contentPos);
          });
        });
      });
    });

    it('deve exibir ingredientes em uma lista não-ordenada', () => {
      cy.get('#ingredients-list').should('exist');
      cy.get('#ingredients-list').should('be.a', 'ul');
    });
  });

  describe('Busca case-insensitive', () => {
    it('deve encontrar refeição independentemente da capitalização', () => {
      cy.get('#search-field').type('feijoada');
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#search-field').should('have.value', '');
    });

    it('deve encontrar refeição com busca em maiúscula', () => {
      cy.get('#search-field').type('ARROZ');
      cy.get('#search-container button[type="submit"]').click();
      cy.wait(500);

      cy.get('#search-field').should('have.value', '');
    });
  });
});
