import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

@injectable()
@autoWired
export class WishlistPage extends YvesPage {
  protected PAGE_URL = '/wishlist';

  createWishlist = (name: string): void => {
    cy.get('#wishlist_form_name').clear();
    cy.get('#wishlist_form_name').type(name);
    cy.get('[data-qa="component wishlist-form"] input[type="submit"]').click();
  };

  getWishlistOverviewEntry = (name: string): Cypress.Chainable =>
    cy.contains('[data-qa="component wishlist-overview-table"] a', name);

  openWishlist = (name: string): void => {
    this.getWishlistOverviewEntry(name).click();
  };

  getWishlistItemsTable = (): Cypress.Chainable => cy.get('[data-qa="component wishlist-table"]');

  // The wishlist selector is a widget on the product detail page: it posts the displayed product
  // to `wishlist/add-item`. Its wishlist picker is filled in by an ajax call after page load, so
  // both entry points below wait for that call to have rendered its field first.
  addDisplayedProductToDefaultWishlist = (): void => {
    // A customer who owns no wishlist gets an empty hidden field rather than a picker, and the
    // server turns that into the default wishlist.
    cy.get('[data-qa="component wishlist-selector-default"] input[name="wishlist-name"]').should('exist');
    this.getAddToWishlistForm().submit();
  };

  getWishlistPicker = (): Cypress.Chainable =>
    cy.get('[data-qa="component wishlist-selector-default"] [name="wishlist-name"]');

  addDisplayedProductToWishlist = (name: string): void => {
    cy.get('[data-qa="component wishlist-selector-default"] select[name="wishlist-name"]').select(name);
    this.getAddToWishlistForm().submit();
  };

  getAddToWishlistForm = (): Cypress.Chainable => cy.get('form.wishlist-selector-default__form');

  // The offer the add would carry. It is filled in server-side from the offer selected on the
  // product detail page, so reading it back proves which merchant the next add belongs to.
  getAddToWishlistProductOfferInput = (): Cypress.Chainable =>
    cy.get('[data-qa="component wishlist-pdp-product-offer"] input[name="product_offer_reference"]');

  moveAllAvailableProductsToCart = (): void => {
    cy.get('form[name="add_all_available_products_to_cart_form"] button[type="submit"]').click();
  };
}
