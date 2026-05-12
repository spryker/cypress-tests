import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CostCenterListRepository {
  getCreateButtonSelector = (): string => 'a[href*="/purchasing-control/cost-center/create"]';
  getTableSelector = (): string => '#cost-center-table';
  getTableBodySelector = (): string => '#cost-center-table tbody';
  getEditLinkSelector = (idCostCenter: number): string => `a[href*="id-cost-center=${idCostCenter}"][href*="/edit"]`;
  getBudgetsLinkSelector = (idCostCenter: number): string =>
    `a[href*="id-cost-center=${idCostCenter}"][href*="/budget"]`;
}
