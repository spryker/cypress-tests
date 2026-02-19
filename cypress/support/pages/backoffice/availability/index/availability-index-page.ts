import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { AvailabilityIndexRepository } from './availability-index-repository';

@injectable()
@autoWired
export class AvailabilityIndexPage extends BackofficePage {
  @inject(AvailabilityIndexRepository) private repository: AvailabilityIndexRepository;

  protected PAGE_URL = '/availability-gui';

  update = (params: UpdateParams): void => {
    this.find({
      interceptTableUrl: `**/availability-gui/index/availability-abstract-table**${params.query}**`,
      searchQuery: params.query,
      expectedCount: 1,
    }).then(($availabilityRow) => {
      if (params.action === ActionEnum.view) {
        cy.wrap($availabilityRow).find(this.repository.getViewButtonSelector()).should('exist').click({ force: true });
      }
    });
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
