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
    this.repository.getVariantFirstTableRow().then(($productVariantRow) => {
      cy.wrap($productVariantRow)
        .find(this.repository.getVariantEditStockButtonSelector())
        .as('editStockVariantButton');
      cy.get('@editStockVariantButton').should('be.visible').click({ force: true });
    });
  };
}
