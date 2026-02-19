import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { CategoryListRepository } from './category-list-repository';

@injectable()
@autoWired
export class CategoryListPage extends BackofficePage {
  @inject(CategoryListRepository) private repository: CategoryListRepository;

  protected PAGE_URL = '/category-gui/list';

  update = (params: UpdateParams): void => {
    this.find({ interceptTableUrl: `**/category-gui/list/table**${params.query}**`, searchQuery: params.query }).then(
      ($categoryRow) => {
        cy.wrap($categoryRow).find(this.repository.getDropdownToggleButtonSelector()).should('exist').click();

        cy.get(this.repository.getDropdownMenuSelector())
          .find(this.repository.getEditButtonSelector())
          .should('exist')
          .click();
      }
    );
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
