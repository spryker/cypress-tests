import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { AvailabilityViewRepository } from './availability-view-repository';

@injectable()
@autoWired
export class AvailabilityViewPage extends BackofficePage {
  @inject(AvailabilityViewRepository) private repository: AvailabilityViewRepository;

  protected PAGE_URL = '/availability-gui/index/view';

  editFirstVariant = (): void => {
    this.repository
      .getVariantFirstTableRow()
      .should(($productVariantRow) => {
        expect($productVariantRow.text()).not.to.contain('Loading');
      })
      .then(($productVariantRow) => {
        cy.wrap($productVariantRow)
          .find(this.repository.getVariantEditStockButtonSelector())
          .as('editStockVariantButton');
        cy.get('@editStockVariantButton').should('be.visible').click({ force: true });
      });
  };

  visitForSku = (params: { sku: string }): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?sku=${encodeURIComponent(params.sku)}`);
  };

  assertReservedProductsAmount = (expected: number): void => {
    this.repository
      .getReservedProductsValue()
      .invoke('text')
      .then((text) => {
        const value = Number.parseFloat(text.replace(/[^0-9.-]/g, ''));
        expect(value, `Expected reserved-products amount to be ${expected}`).to.equal(expected);
      });
  };
}
