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

  // Flaky fix: the product tile is always indexed from fixtures, so waiting for the
  // tile returns before the just-published visibility change has propagated to
  // ES/Redis. Reload the PLP until the badge state itself matches, so the following
  // assertion no longer races the async publish worker.
  visitSearchAndWaitForBadgeVisible = (query: string, attributeValue: string): void => {
    this.reloadSearchUntilBadgeState(query, attributeValue, true);
  };

  visitSearchAndWaitForBadgeNotVisible = (query: string, attributeValue: string): void => {
    this.reloadSearchUntilBadgeState(query, attributeValue, false);
  };

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
