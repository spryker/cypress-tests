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
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal synchronization guard: waits out the table "Loading" spinner between actions.
    this.repository
      .getVariantFirstTableRow()
      .should(($productVariantRow) => {
        // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal synchronization guard: waits out the table "Loading" spinner between actions.
        expect($productVariantRow.text()).not.to.contain('Loading');
      })
      .then(($productVariantRow) => {
        cy.wrap($productVariantRow)
          .find(this.repository.getVariantEditStockButtonSelector())
          .as('editStockVariantButton');
        // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Internal synchronization guard: waits for the edit-stock button to be actionable before clicking.
        cy.get('@editStockVariantButton').should('be.visible').click({ force: true });
      });
  };
}
