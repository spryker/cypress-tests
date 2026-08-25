import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

@injectable()
@autoWired
export class ShoppingListPage extends YvesPage {
  protected PAGE_URL = '/shopping-list';

  createShoppingList = (name: string): void => {
    cy.get('#shopping_list_form_name').clear();
    cy.get('#shopping_list_form_name').type(name);
    cy.get('form[name="shopping_list_form"] [data-qa="submit-button"]').click();
  };

  getShoppingListOverviewEntry = (name: string): Cypress.Chainable =>
    cy.contains('[data-qa="component shopping-list-overview"] a', name);

  openShoppingList = (name: string): void => {
    this.getShoppingListOverviewEntry(name).click();
  };

  getShoppingListItemsTable = (): Cypress.Chainable => cy.get('[data-qa="component shopping-list"]');

  getShoppingListOverviewRow = (name: string): Cypress.Chainable =>
    cy.contains('[data-qa="component shopping-list-overview"] tbody tr', name);

  // The visible Share button on a list's own page. Scoped to the customer content, because the
  // collapsed side drawer carries a hidden copy of the same link.
  openSharePage = (): void => {
    cy.get('#customer-content a[href*="/shopping-list/share/"]').first().click();
  };

  shareWithCompanyUser = (params: ShareWithCompanyUserParams): void => {
    cy.contains('[data-qa="component share-list-item"]', params.name).find('select').select(params.accessLevel);
    cy.get('form[name="share_shopping_list_form"] [data-qa="submit-button"]').click();
  };

  addAllAvailableProductsToCart = (): void => {
    cy.get('form[name="shopping_list_add_item_to_cart_form"] button[name="add-all-available"]').click();
  };

  // The add-to-shopping-list widget lives on the product detail page. Its offer field is filled in
  // server-side from the offer selected there, so reading it back proves which merchant the next
  // add belongs to.
  getAddToShoppingListProductOfferInput = (): Cypress.Chainable =>
    cy.get('form.js-shopping-list__form input[name="productOfferReference"]');

  addDisplayedProductToShoppingList = (name: string): void => {
    cy.get('form.js-shopping-list__form select[name="idShoppingList"]').select(name);
    cy.get('[data-qa="add-to-shopping-list-button"]').click();
  };
}

interface ShareWithCompanyUserParams {
  name: string;
  accessLevel: string;
}
