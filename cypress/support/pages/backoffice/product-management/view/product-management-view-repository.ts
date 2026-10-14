import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementViewRepository {
  private readonly GENERAL_INFORMATION_HEADING = 'General Information';

  getGeneralInformation = (): Cypress.Chainable => {
    return cy
      .get('.ibox-title h5')
      .contains(this.GENERAL_INFORMATION_HEADING)
      .parents('.ibox')
      .first()
      .find('.ibox-content')
      .first();
  };

  // Zed renders the block as label/value column pairs with no data attribute, so the label text is the anchor.
  // Its case depends on the shop's Zed translations (Sku on suite, SKU on the B2C marketplace).
  getGeneralInformationValue = (label: string): Cypress.Chainable => {
    return this.getGeneralInformation()
      .find('> .row')
      .filter((_index, row) => Cypress.$(row).children().first().text().trim().toLowerCase() === label.toLowerCase())
      .children()
      .last();
  };
}
