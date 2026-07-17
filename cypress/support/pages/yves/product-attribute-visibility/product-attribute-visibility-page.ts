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
      const items = $body.find(this.repository.getProductItemSelector());
      const badgeVisible =
        items.length > 0 &&
        items.first().find(`${this.repository.getAttributeBadgeSelector()}:contains("${attributeValue}")`).length > 0;

      // An empty result list must not settle the wait: with no tile rendered the badge is
      // trivially "not visible" and the negative wait would return before propagation.
      if (items.length > 0 && badgeVisible === shouldBeVisible) {
        return;
      }

      if (retries === 0) {
        throw new Error(
          `Attribute badge "${attributeValue}" did not become ${
            shouldBeVisible ? 'visible' : 'hidden'
          } on the PLP before the reload budget ran out`
        );
      }

      cy.wait(retryWait);
      this.reloadSearchUntilBadgeState(query, attributeValue, shouldBeVisible, retries - 1, retryWait);
    });
  };

  navigateToProductDetailPage = (abstractSku: string): void => {
    this.visitSearchAndWaitForProduct(abstractSku);

    cy.get(this.repository.getProductItemSelector()).first().find('a').first().click();
    cy.url().should('not.include', '/search');
  };

  assertPlpAttributeBadgeVisible = (attributeValue: string): void => {
    cy.get(this.repository.getProductItemSelector())
      .first()
      .within(() => {
        cy.get(this.repository.getAttributeBadgeSelector()).should('contain', attributeValue);
      });
  };

  assertPlpAttributeBadgeNotVisible = (attributeValue: string): void => {
    cy.get(this.repository.getProductItemSelector()).first().should('not.contain', attributeValue);
  };

  assertPdpAttributeVisible = (attributeValue: string): void => {
    cy.get(this.repository.getPdpAttributeSelector()).should('contain', attributeValue);
  };

  assertPdpAttributeNotVisible = (attributeValue: string): void => {
    cy.get(this.repository.getPdpAttributeSelector()).should('not.contain', attributeValue);
  };

  assertCartAttributeBadgeVisible = (attributeValue: string): void => {
    cy.visit('/cart');

    cy.get(this.repository.getCartItemSelector())
      .first()
      .within(() => {
        cy.get(this.repository.getAttributeBadgeSelector()).should('contain', attributeValue);
      });
  };

  assertCartAttributeBadgeNotVisible = (attributeValue: string): void => {
    cy.visit('/cart');

    cy.get(this.repository.getCartItemSelector()).first().should('not.contain', attributeValue);
  };
}
