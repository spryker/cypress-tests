import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BackofficeBudgetListRepository {
  getCreateButtonSelector = (): string => 'a[href*="/purchasing-control/budget/create"]';
  getTableBodySelector = (): string => '#budget-table tbody';
  getEditLinkSelector = (idBudget: number): string => `a[href*="id-budget=${idBudget}"][href*="/edit"]`;
}
