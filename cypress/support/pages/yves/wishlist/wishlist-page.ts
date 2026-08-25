import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

@injectable()
@autoWired
export class WishlistPage extends YvesPage {
  protected PAGE_URL = '/wishlist';

  // Generated here, not taken from a fixture, so a retry creates a wishlist of its own rather than a
  // second one under the failed attempt's name. The form's name validation allows only [ A-Za-z0-9_-].
  createWishlist = (name?: string): string => {
    const wishlistName = name ?? `Wishlist ${this.faker.string.uuid()}`;

    cy.get('#wishlist_form_name').clear();
    cy.get('#wishlist_form_name').type(wishlistName);
    cy.get('[data-qa="component wishlist-form"] input[type="submit"]').click();

    return wishlistName;
  };

  getWishlistOverviewEntry = (name: string): Cypress.Chainable =>
    cy.contains('[data-qa="component wishlist-overview-table"] a', name);

  openWishlist = (name: string): void => {
    this.getWishlistOverviewEntry(name).click();
  };

  getWishlistItemsTable = (): Cypress.Chainable => cy.get('[data-qa="component wishlist-table"]');

  // The wishlist selector is a widget on the product detail page: it posts the displayed product
  // to `wishlist/add-item`. Its picker is filled in by an ajax call after page load, so reading it
  // is what waits for that call to have rendered.
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
