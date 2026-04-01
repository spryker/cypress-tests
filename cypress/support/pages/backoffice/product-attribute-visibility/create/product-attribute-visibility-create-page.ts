import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductAttributeVisibilityCreateRepository } from './product-attribute-visibility-create-repository';

@injectable()
@autoWired
export class ProductAttributeVisibilityCreatePage extends BackofficePage {
  @inject(ProductAttributeVisibilityCreateRepository) private repository: ProductAttributeVisibilityCreateRepository;

  protected PAGE_URL = '/product-attribute-gui/attribute/create';

  createAttribute = (key: string, visibilityTypes: string[]): void => {
    this.visit();

    this.repository.getKeyInput().clear();
    this.repository.getKeyInput().type(key);
    this.repository.getInputTypeSelect().select('text');
    this.repository.getAllowInputCheckbox().check();
    this.repository.getVisibilityTypesSelect().invoke('val', visibilityTypes).trigger('change', { force: true });
    this.repository.getSubmitButton().click();

    cy.url().should('contain', '/translate');
  };
}
