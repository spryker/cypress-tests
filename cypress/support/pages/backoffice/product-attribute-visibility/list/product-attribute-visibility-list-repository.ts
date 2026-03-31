import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductAttributeVisibilityListRepository {
  getTableHeadSelector = (): string => 'table thead';
  getVisibilityFilterSelector = (): string => '#table_filter_form_visibilityTypes';
  getVisibilityFilterContainerSelector = (): string => '#table_filter_form_visibilityTypes + .select2-container';
  getFilterDropdownOptionSelector = (): string => '.select2-results__option';
  getFilterSubmitButtonSelector = (): string => '#product-attribute-gui-filter-form button';
  getSearchInputSelector = (): string => 'input[type="search"][data-qa="table-search"]';
  getTableBodyRowsSelector = (): string => '.dataTable tbody tr';
  getDisplayAtColumnIndex = (): number => 4;
}
