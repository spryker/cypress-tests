import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductAttributeVisibilityEditRepository } from './product-attribute-visibility-edit-repository';

@injectable()
@autoWired
export class ProductAttributeVisibilityEditPage extends BackofficePage {
  @inject(ProductAttributeVisibilityEditRepository) private repository: ProductAttributeVisibilityEditRepository;

  protected PAGE_URL = '/product-attribute-gui/attribute';

  updateAttributeVisibility = (attributeKey: string, visibilityTypes: string[]): void => {
    this.visit();

    cy.get(this.repository.getTableBodyRowsSelector()).should('be.visible');
    cy.get(this.repository.getSearchInputSelector()).should('be.visible').type(`{selectall}${attributeKey}`);

    cy.get(this.repository.getTableBodyRowsSelector()).should(($tbody) => {
      const text = $tbody.text();
      expect(text.includes(attributeKey)).to.be.true;
    });

    cy.get(this.repository.getTableBodyRowsSelector()).first().contains('Edit').click();

    this.repository.getVisibilityTypesSelect().invoke('val', visibilityTypes).trigger('change', { force: true });
    this.repository.getSubmitButton().click();

    cy.url().should('contain', '/translate');
  };
}
