import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { MerchantRelationshipCreateRepository } from './merchant-relationship-create-repository';

@injectable()
@autoWired
export class MerchantRelationshipCreatePage extends BackofficePage {
  @inject(MerchantRelationshipCreateRepository) private repository: MerchantRelationshipCreateRepository;

  protected PAGE_URL = '/merchant-relationship-gui/create-merchant-relationship';

  create = (params: CreateParams): void => {
    this.repository.getMerchantSelect().select(String(params.idMerchant), { force: true });
    this.repository.getCompanySelect().select(String(params.idCompany), { force: true });
    this.repository.getConfirmButton().click();

    this.repository.getOwnerBusinessUnitSelect().select(String(params.idCompanyBusinessUnit), { force: true });
    this.repository.getAssignedBusinessUnitsSelect().select([String(params.idCompanyBusinessUnit)], { force: true });
    this.repository.getSaveButton().click();
  };
}

interface CreateParams {
  idMerchant: number;
  idCompany: number;
  idCompanyBusinessUnit: number;
}
