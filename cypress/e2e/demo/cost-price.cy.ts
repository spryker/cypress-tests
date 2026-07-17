import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AgentLoginScenario, CustomerLoginScenario } from '@scenarios/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CostPricePage } from '@pages/backoffice';
import { AgentQuoteRequestPage } from '@pages/yves';
import { ProductsPage } from '@pages/mp';
import { CostPriceDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Cost Price - RFQ cost prices & margins across Back Office, Merchant Portal and storefront',
  {
    tags: ['@demo', '@cost-price'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const agentLoginScenario = container.get(AgentLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    const costPricePage = container.get(CostPricePage);
    const quoteRequestPage = container.get(AgentQuoteRequestPage);
    const productsPage = container.get(ProductsPage);

    let staticFixtures: CostPriceDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    describe('Back Office - admin edits & views imported cost prices', (): void => {
      beforeEach((): void => {
        userLoginScenario.execute({
          username: staticFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
      });

      it(
        'product edit form opens for the SKU and shows a price table with Cost, Gross and Net price columns and editable cost-amount inputs',
        { tags: ['@demo-smoke'] },
        (): void => {
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
        }
      );

      it(
        'editing a cost-amount value and saving the product persists the new cost price across a reload',
        { tags: ['@demo-smoke'] },
        (): void => {
          costPricePage
            .visitProductEdit(staticFixtures.product.idProductAbstract)
            .its('response.statusCode')
            .should('eq', 200);

          costPricePage.openPriceTaxTab();

          costPricePage.getFirstCostAmountValue().then((originalValue) => {
            const newCostValue = '333.33';

            costPricePage.setFirstCostAmount(newCostValue);
            costPricePage.save();
            costPricePage.verifySaveSuccess(staticFixtures.product.sku);

            costPricePage.visitProductEdit(staticFixtures.product.idProductAbstract);
            costPricePage.openPriceTaxTab();
            costPricePage.assertFirstCostAmount(newCostValue);

            costPricePage.setFirstCostAmount(String(originalValue));
            costPricePage.save();
            costPricePage.verifySaveSuccess(staticFixtures.product.sku);
          });
        }
      );

      it(
        'product view page shows a visible Price & Taxes widget with a Cost price row rendering a non-empty value',
        { tags: ['@demo-smoke'] },
        (): void => {
          costPricePage
            .visitProductView(staticFixtures.product.idProductAbstract)
            .its('response.statusCode')
            .should('eq', 200);

          costPricePage.getPriceTaxWidget().should('be.visible');
          costPricePage.getCostPriceViewRow().should('have.length.at.least', 1).and('be.visible');

          costPricePage
            .getCostPriceViewValues()
            .should('have.length.at.least', 1)
            .first()
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.match(/\d/);
            });
        }
      );
    });

    describe('Merchant Portal - merchant user manages the Cost price column', (): void => {
      const editedCostValue = '291.00';
      const editedCostDisplayValue = '291';
      let costValueToRestore: string | null = null;

      beforeEach((): void => {
        merchantUserLoginScenario.execute({
          username: staticFixtures.merchant.username,
          password: staticFixtures.defaultPassword,
        });
      });

      afterEach((): void => {
        if (costValueToRestore === null) {
          return;
        }

        const originalValue = costValueToRestore;
        costValueToRestore = null;

        merchantUserLoginScenario.execute({
          username: staticFixtures.merchant.username,
          password: staticFixtures.defaultPassword,
        });
        productsPage.visit();
        productsPage.find({ query: staticFixtures.merchantProduct.sku });
        productsPage.openProductBySku(staticFixtures.merchantProduct.sku);

        productsPage.getCostColumnValues().then((currentCostValues) => {
          if (!currentCostValues.includes(editedCostDisplayValue)) {
            return;
          }

          productsPage.editCostAmountByCurrentValue(editedCostDisplayValue, originalValue);
          productsPage.saveDrawer();
        });
      });

      it(
        'merchant product price grid exposes a "Cost Default" column alongside the Net/Gross price columns',
        { tags: ['@demo-smoke'] },
        (): void => {
          productsPage.visit();
          productsPage.find({ query: staticFixtures.merchantProduct.sku });
          productsPage.openProductBySku(staticFixtures.merchantProduct.sku);

          productsPage.getPriceTableHeaders().then(($headers) => {
            const headerTexts = $headers.toArray().map((th: HTMLElement) => th.textContent?.trim());

            expect(headerTexts).to.include(productsPage.getCostPriceColumnTitle());
            expect(headerTexts).to.include('Gross Default');
            expect(headerTexts).to.include('Net Default');
          });
        }
      );

      it(
        'merchant edits a Cost Default cell in the price grid, saves, and the new cost value persists after reopening the product',
        { tags: ['@demo-smoke'] },
        (): void => {
          productsPage.visit();
          productsPage.find({ query: staticFixtures.merchantProduct.sku });
          productsPage.openProductBySku(staticFixtures.merchantProduct.sku);

          productsPage.getCostColumnValues().then((originalCostValues) => {
            const originalFirstCost = originalCostValues[0];

            expect(originalFirstCost, 'the first price row has a cost value to edit').to.match(/\d/);
            costValueToRestore = originalFirstCost;

            productsPage.editFirstCostAmount(editedCostValue);
            productsPage.saveDrawer();

            productsPage.visit();
            productsPage.find({ query: staticFixtures.merchantProduct.sku });
            productsPage.openProductBySku(staticFixtures.merchantProduct.sku);

            productsPage.getCostColumnValues().then((persistedCostValues) => {
              expect(persistedCostValues, 'the edited cost value is persisted in the Cost Default column').to.include(
                editedCostDisplayValue
              );
            });
          });
        }
      );
    });

    describe('Storefront customer - cost price and margin are hidden', (): void => {
      beforeEach((): void => {
        customerLoginScenario.execute({
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });
      });

      it(
        'a plain customer opening their quote request sees the line items but no cost-price molecule or gross-margin',
        { tags: ['@demo-smoke'] },
        (): void => {
          quoteRequestPage
            .visitCustomerDetails(staticFixtures.quoteRequest.calculatedReference)
            .its('response.statusCode')
            .should('eq', 200);

          quoteRequestPage.getCartItems().should('have.length.at.least', 1);
          quoteRequestPage.getCostPriceMolecules().should('have.length', 0);
          quoteRequestPage.getGrossMargins().should('have.length', 0);
        }
      );
    });

    describe('Storefront agent - cost price and gross margin per line item', (): void => {
      beforeEach((): void => {
        agentLoginScenario.execute({
          username: staticFixtures.agent.username,
          password: staticFixtures.defaultPassword,
        });
      });

      it(
        'agent opening a calculated quote request sees a cost-price molecule with a real gross-margin percentage on every line item',
        { tags: ['@demo-smoke'] },
        (): void => {
          quoteRequestPage.recalculate(staticFixtures.quoteRequest.calculatedReference);

          quoteRequestPage.getCartItems().then(($items) => {
            const itemCount = $items.length;

            expect(itemCount).to.be.greaterThan(0);

            quoteRequestPage.getCostPriceMolecules().should('have.length', itemCount);
            quoteRequestPage.getCostPriceValues().filter('[data-has-cost-price="1"]').should('have.length', itemCount);
            quoteRequestPage.getGrossMargins().should('have.length', itemCount);
          });

          quoteRequestPage
            .getGrossMargins()
            .first()
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.match(/\d+\s*%/);
            });
        }
      );

      it(
        'each cost-price molecule renders its two branches consistently: an available margin shows a percentage, an unavailable one shows "—" paired with a warning icon',
        { tags: ['@demo-smoke'] },
        (): void => {
          quoteRequestPage.visitDetails(staticFixtures.quoteRequest.uncalculatedReference);

          quoteRequestPage.getCartItems().should('have.length.at.least', 1);
          quoteRequestPage.getCostPriceMolecules().should('have.length.at.least', 1);

          const unavailableText = quoteRequestPage.getUnavailableCostPriceText();

          quoteRequestPage.getGrossMargins().each(($margin) => {
            const text = $margin.text().trim();

            if (quoteRequestPage.isGrossMarginUnavailable($margin)) {
              expect(text).to.eq(unavailableText);
            } else {
              expect(text).to.match(/\d+\s*%/);
            }
          });

          quoteRequestPage.getCostPriceValues().each(($value) => {
            const hasCostPrice = $value.attr(quoteRequestPage.getCostPriceDataAttribute());

            expect(hasCostPrice, 'each cost-price value declares its data state').to.be.oneOf(['0', '1']);
            if (hasCostPrice === '0') {
              expect($value.text().trim()).to.eq(unavailableText);
            }
          });

          quoteRequestPage.getGrossMarginUnavailable().then(($unavailable) => {
            quoteRequestPage.getCostPriceWarningIcon().then(($icons) => {
              if ($unavailable.length) {
                expect($icons.length, 'unavailable margins are paired with a warning icon').to.be.greaterThan(0);
              } else {
                expect($icons.length, 'no warning icon without an unavailable margin').to.eq(0);
              }
            });
          });
        }
      );

      it(
        'editing and saving a quote request as agent keeps a real gross-margin percentage on every line item (recalculation applies)',
        { tags: ['@demo-smoke'] },
        (): void => {
          quoteRequestPage.recalculate(staticFixtures.quoteRequest.uncalculatedReference);

          quoteRequestPage.getGrossMargins().should('have.length.at.least', 1);
          quoteRequestPage.getGrossMarginUnavailable().should('have.length', 0);
          quoteRequestPage
            .getGrossMargins()
            .first()
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.match(/\d+\s*%/);
            });
        }
      );
    });
  }
);
