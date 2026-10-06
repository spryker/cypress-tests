import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductSetCreateRepository } from './product-set-create-repository';

@injectable()
@autoWired
export class ProductSetCreatePage extends BackofficePage {
  @inject(ProductSetCreateRepository) private repository: ProductSetCreateRepository;

  protected PAGE_URL = '/product-set-gui/create';

  create = (params: CreateParams): void => {
    this.visit();

    // Whether the second locale opens collapsed depends on how many locales the shop has, and a
    // collapsed block's fields are not typeable, so each block is opened if it is not open already.
    this.repository
      .getGeneralBlock()
      .find(this.repository.getLocalizedBlockSelector())
      .each(($block) => {
        if (!$block.find(this.repository.getIboxContentSelector()).is(':visible')) {
          cy.wrap($block).find(this.repository.getCollapseLinkSelector()).click({ force: true });
        }
      });

    // The same name and url key in every locale: each locale prefixes the key with its own
    // language segment, so one key still yields one distinct storefront url per locale.
    this.repository
      .getGeneralBlock()
      .find(this.repository.getLocalizedBlockSelector())
      .each(($block) => {
        cy.wrap($block).find(this.repository.getLocalizedNameSelector()).clear();
        cy.wrap($block).find(this.repository.getLocalizedNameSelector()).type(params.name);
        cy.wrap($block).find(this.repository.getLocalizedUrlSelector()).clear();
        cy.wrap($block).find(this.repository.getLocalizedUrlSelector()).type(params.urlKey);
      });

    this.repository.getProductSetKeyInput().clear();
    this.repository.getProductSetKeyInput().type(params.setKey);
    this.repository.getIsActiveCheckbox().check();

    this.repository.getProductsTab().click();
    params.productAbstractSkus.forEach((sku, index) => this.assignProduct(sku, index + 1));

    this.repository.getSaveButton().click();

    // A rejected form silently re-renders itself, so the redirect to the view page is the only
    // proof that the set was stored rather than that the click happened.
    cy.url().should('include', '/product-set-gui/view');
  };

  private assignProduct(abstractSku: string, expectedAssignedCount: number): void {
    this.repository.getProductSearchInput().clear();
    this.repository.getProductSearchInput().type(abstractSku);

    // The picker is server-side, so the click has to wait for the redraw that narrows the four
    // hundred demo products down to this one - otherwise it ticks whatever row was already there.
    this.repository.getProductTableInfo().should('contain', 'filtered from');
    this.repository.getProductTableProcessing().should('not.be.visible');
    this.repository.getProductRows().should('have.length', 1);
    this.repository.getProductRows().should('contain', abstractSku);

    this.repository.getProductRowCheckboxes().first().check();

    // Ticking a row is what appends its id to the hidden field the form posts, and the form rejects
    // a set of fewer than two products, so each pick is counted rather than only the last one.
    this.repository
      .getAssignedProductsField()
      .invoke('val')
      .should((value) => {
        expect(String(value).split(',').filter(Boolean)).to.have.length(expectedAssignedCount);
      });
  }
}

interface CreateParams {
  name: string;
  urlKey: string;
  setKey: string;
  productAbstractSkus: string[];
}
