import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { ProductAttributeVisibilityRepository } from './product-attribute-visibility-repository';

@injectable()
@autoWired
export class ProductAttributeVisibilityPage extends YvesPage {
  @inject(ProductAttributeVisibilityRepository) private repository: ProductAttributeVisibilityRepository;

  protected PAGE_URL = '/search';

  visitSearchAndWaitForProduct = (query: string): void => {
    cy.reloadUntilFound(`/search?q=${query}`, this.repository.getProductItemSelector(), 'body', 3, 1000);
  };

  /**
   * Reloads the PLP until the attribute badge is visible before returning.
   * The product tile is always indexed from fixtures, so waiting on the tile returns
   * before a just-published visibility change has propagated to ES/Redis — this keeps
   * the following assertion from racing the async publish worker.
   */
  visitSearchAndWaitForBadgeVisible = (query: string, attributeValue: string): void => {
    this.reloadSearchUntilBadgeState(query, attributeValue, true);
  };

  /**
   * Reloads the PLP until the attribute badge is no longer visible before returning.
   * The stale badge lingers on the PLP until the publish worker's removal reaches storage.
   */
  visitSearchAndWaitForBadgeNotVisible = (query: string, attributeValue: string): void => {
    this.reloadSearchUntilBadgeState(query, attributeValue, false);
  };

  /**
   * Reloads `/search?q=<query>` until the first tile's attribute badge matches
   * `shouldBeVisible`, or `retries` is exhausted.
   */
  private reloadSearchUntilBadgeState = (
    query: string,
    attributeValue: string,
    shouldBeVisible: boolean,
    retries = 8,
    retryWait = 1000
  ): void => {
    cy.visit(`/search?q=${query}`);
    cy.get('body').then(($body) => {
      const item = $body.find(this.repository.getProductItemSelector()).first();
      const badgeVisible =
        item.find(`${this.repository.getAttributeBadgeSelector()}:contains("${attributeValue}")`).length > 0;

      if (badgeVisible === shouldBeVisible || retries === 0) {
        return;
      }

      cy.wait(retryWait);
      this.reloadSearchUntilBadgeState(query, attributeValue, shouldBeVisible, retries - 1, retryWait);
    });
  };

  navigateToProductDetailPage = (abstractSku: string): void => {
    this.visitSearchAndWaitForProduct(abstractSku);

    cy.get(this.repository.getProductItemSelector()).first().find('a').first().click();
  };

  visitCart = (): void => {
    cy.visit('/cart');
  };

  getFirstProductItem = (): Cypress.Chainable => cy.get(this.repository.getProductItemSelector()).first();

  getAttributeBadge = (): Cypress.Chainable => cy.get(this.repository.getAttributeBadgeSelector());

  getPdpAttribute = (): Cypress.Chainable => cy.get(this.repository.getPdpAttributeSelector());

  getFirstCartItem = (): Cypress.Chainable => cy.get(this.repository.getCartItemSelector()).first();
}
