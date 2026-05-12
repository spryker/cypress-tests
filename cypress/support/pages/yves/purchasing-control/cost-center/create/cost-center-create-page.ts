import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CostCenterCreateRepository } from './cost-center-create-repository';

@injectable()
@autoWired
export class YvesCostCenterCreatePage extends YvesPage {
  @inject(REPOSITORIES.YvesCostCenterCreateRepository)
  private repository: CostCenterCreateRepository;

  protected PAGE_URL = '/company/cost-center/create';

  fillName = (name: string): void => {
    this.repository.getNameInput().clear().type(name);
  };

  fillDescription = (description: string): void => {
    this.repository.getDescriptionTextarea().clear().type(description);
  };

  submit = (): void => {
    this.repository.getSubmitButton().click();
  };

  assertSuccess = (): void => {
    this.repository.getSuccessFlashMessage().should('be.visible');
  };
}
