import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CostPricePage } from '@pages/backoffice';
import { CostPriceDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Cost Price - Back Office product price editing & display',
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

    it('product edit form opens for the SKU and shows a price table with Cost, Gross and Net price columns and editable cost-amount inputs', (): void => {
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

    it('product view page shows a visible Price & Taxes widget containing the Cost price row', (): void => {
      costPricePage
        .visitProductView(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      costPricePage.getPriceTaxWidget().should('be.visible');

      costPricePage.getCostPriceViewRow().should('have.length.at.least', 1).and('be.visible');
    });
  }
);
