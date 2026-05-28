import { injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { CreateJobRepository } from './create-job-repository';

@injectable()
export class CreateJobPage extends BackofficePage {
  protected PAGE_URL = '/import-gui/create-job';

  constructor(private readonly repository: CreateJobRepository) {
    super();
  }

  createJob = (params: { name: string; description?: string }): void => {
    this.visit();

    this.repository.getNameFieldSelector().clear().type(params.name);

    if (params.description) {
      this.repository.getDescriptionFieldSelector().clear().type(params.description);
    }

    this.repository.getSaveButton().click();
  };
}
