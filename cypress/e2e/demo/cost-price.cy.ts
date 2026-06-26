import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CostPricePage } from '@pages/backoffice';
import { CostPriceDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Cost Price & Gross Margin" feature — PART 7a only,
 * the Back Office ProductManagement surface (`src/Demo/Zed/ProductManagement`).
 *
 * The Demo build adds a project-level Cost-price column (price mode `COST_MODE` / `priceModeCost`)
 * to two Back Office product surfaces, neither of which exists in the core vendor templates:
 *   1. Edit form (`/product-management/edit?id-product-abstract=<id>`) — the price matrix
 *      `#price-table-collection` gains a "Cost price" column with editable `input[name*=cost_amount]`
 *      fields, alongside the core "Gross price" and "Net price" columns
 *      (src/Demo/Zed/ProductManagement/Presentation/_partials/product_price_collection.twig).
 *   2. View page (`/product-management/view?id-product-abstract=<id>`) — the "Price & Taxes" widget
 *      gains a `Cost price (<PRICE_TYPE>):` row beside the Net/Gross rows
 *      (src/Demo/Zed/ProductManagement/Presentation/View/_partials/info-price-tax.twig).
 *
 * Scope: confirm both pages load (HTTP 200, no 500/crash) and that the Demo-only cost-price controls
 * render — the cost column header + at least one enabled cost input on edit, and the cost row on view.
 * This guards the upmerge regression class where the Demo override is dropped and the cost
 * column/row silently disappears while Gross/Net remain. Cost Price is NOT an AI feature and has no
 * toggle gate — the fields are configured/visible by default for the Back Office.
 *
 * Smoke discipline: the cost inputs are asserted present/visible/editable but NEVER submitted — no
 * Save is clicked, nothing is persisted. Parts 7b (Merchant Portal) and 7c (agent storefront
 * cost-price molecule) are parked defects/blockers and are deliberately out of scope here.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'cost price',
  {
    tags: ['@demo', '@cost-price', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Cost Price demo feature ships only in b2b-mp', () => {});
      return;
    }

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

      // The price matrix lives inside the inactive "Price & Tax" tab pane (`display:none` until the
      // tab is clicked), so assert presence in the DOM rather than visibility — smoke only.
      costPricePage.getPriceTable().should('exist');

      // The Demo cost column sits beside the core Gross/Net columns — assert all three headers exist.
      costPricePage.getPriceTableHeaders().then(($headers) => {
        const headerTexts = $headers.toArray().map((th: HTMLElement) => th.textContent?.trim());

        expect(headerTexts).to.include('Cost price');
        expect(headerTexts).to.include('Gross price');
        expect(headerTexts).to.include('Net price');
      });

      // At least one cost input, and none disabled/readonly (cost is editable in the Back Office).
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

      // The Demo override adds the cost row beside the core Net/Gross rows.
      costPricePage.getCostPriceViewRow().should('have.length.at.least', 1).and('be.visible');
    });
  }
);
