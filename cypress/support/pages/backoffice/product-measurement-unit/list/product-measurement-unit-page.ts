import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { ActionEnum, BackofficePage } from '@pages/backoffice';
import {
  ProductMeasurementUnitListRepository,
} from './product-measurement-unit-list-repository';

@injectable()
@autoWired
export class ProductMeasurementUnitPage extends BackofficePage {
  @inject(ProductMeasurementUnitListRepository) private repository: ProductMeasurementUnitListRepository;

  protected PAGE_URL = '/product-measurement-unit-gui';

  clickEditAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getEditButtonSelector()).should('exist').click();
  };

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };

  update = (params: UpdateParams): void => {
    this.find({ searchQuery: params.query, tableUrl: '/product-measurement-unit-gui/index/table**' }).then(($productRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($productRow).find(this.repository.getEditButtonSelector()).as('editButton');
        cy.get('@editButton').click();
      }
      if (params.action === ActionEnum.deny) {
        cy.wrap($productRow).find(this.repository.getDenyButtonSelector()).as('denyButton');
        cy.get('@denyButton').click();
      }
    });
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
