import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CostPricePage } from '@pages/backoffice';
import { CostPriceDemoStaticFixtures } from '@interfaces/demo';

describe(
  'cost price',
  {
    tags: ['@demo', '@cost-price'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const costPricePage = container.get(CostPricePage);

    let staticFixtures: CostPriceDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('renders the Cost price column with editable cost inputs on the product edit form', (): void => {
      costPricePage
        .visitProductEdit(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      cy.title().should('contain', staticFixtures.product.sku);

      costPricePage.getPriceTable().should('exist');

      costPricePage.getPriceTableHeaders().then(($headers) => {
        const headerTexts = $headers.toArray().map((th: HTMLElement) => th.textContent?.trim());

        expect(headerTexts).to.include('Cost price');
        expect(headerTexts).to.include('Gross price');
        expect(headerTexts).to.include('Net price');
      });

      costPricePage
        .getCostAmountInputs()
        .should('have.length.at.least', 1)
        .each(($input) => {
          cy.wrap($input).should('not.be.disabled').and('not.have.attr', 'readonly');
        });
    });

    it('renders the Cost price row in the Price & Taxes widget on the product view page', (): void => {
      costPricePage
        .visitProductView(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      costPricePage.getPriceTaxWidget().should('be.visible');

      costPricePage.getCostPriceViewRow().should('have.length.at.least', 1).and('be.visible');
    });
  }
);
