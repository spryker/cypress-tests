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
