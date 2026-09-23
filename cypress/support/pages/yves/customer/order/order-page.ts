import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { OrderRepository } from './order-repository';

@injectable()
@autoWired
export class OrderPage extends YvesPage {
  @inject(REPOSITORIES.OrderRepository) private repository: OrderRepository;

  protected PAGE_URL = '/customer/order';

  applyCompanyOrdersFilter = (): void => {
    if (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      cy.get('body').then(($body) => {
        if ($body.find('[data-qa="order-filter-section"].is-hidden').length) {
          cy.get('[data-qa="order-filters-toggle"]').click();
          this.repository.getOrderFilterApplyButton().should('be.visible');
        }
      });
    }

    this.repository.getOrderBusinessUnitFilter().select('company', { force: true });
    this.repository.getOrderFilterApplyButton().click();
  };

  editOrder = (): void => {
    this.repository.getEditOrderButton().click();

    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      this.repository.getEditOrderConfirmButton().click();
    }
  };
}
