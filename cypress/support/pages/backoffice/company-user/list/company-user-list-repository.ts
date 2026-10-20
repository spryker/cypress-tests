import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyUserListRepository {
  getCompanyUserNameCellSelector = (): string => 'td:nth-child(3)';
}
