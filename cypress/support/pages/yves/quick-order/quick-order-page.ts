import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { QuickOrderRepository } from './quick-order-repository';

@injectable()
@autoWired
export class QuickOrderPage extends YvesPage {
  @inject(REPOSITORIES.QuickOrderRepository) private repository: QuickOrderRepository;

  protected PAGE_URL = '/quick-order';

  // One "<sku>,<quantity>" per line, which is what the page tells the buyer to paste in.
  verifyPastedOrder = (pastedOrder: string): void => {
    cy.get('#text_order_form_textOrder').clear();
    cy.get('#text_order_form_textOrder').type(pastedOrder);
    cy.get('button[name="textOrder"]').click();
  };

  addRowsToCart = (): void => {
    cy.get('button[name="addToCart"]').click();
  };

  addRowsToShoppingList = (name: string): void => {
    cy.get('select[name="idShoppingList"]').select(name);
    cy.get('button[name="addToShoppingList"]').click();
  };

  uploadVisualAddToCartFile = (params: UploadedOrderFile): void => {
    this.repository.getVisualAddToCartFileInput().selectFile(
      {
        contents: Cypress.Buffer.from(params.contents),
        fileName: params.fileName,
        mimeType: params.mimeType,
      },
      { force: true }
    );
    this.repository.getVisualAddToCartUploadButton().click();
  };

  getVisualAddToCartForm = (): Cypress.Chainable => this.repository.getVisualAddToCartForm();

  getVisualAddToCartFileInput = (): Cypress.Chainable => this.repository.getVisualAddToCartFileInput();

  getVisualAddToCartDescription = (): Cypress.Chainable => this.repository.getVisualAddToCartDescription();
}

interface UploadedOrderFile {
  contents: string;
  fileName: string;
  mimeType: string;
}
