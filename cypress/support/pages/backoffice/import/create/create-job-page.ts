import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { CreateJobRepository } from './create-job-repository';

@injectable()
@autoWired
export class CreateJobPage extends BackofficePage {
  @inject(CreateJobRepository) private repository: CreateJobRepository;

  protected PAGE_URL = '/product-experience-management/job/create';

  createJob = (params: { name: string; description?: string }): void => {
    this.visit();

    this.repository.getNameFieldSelector().clear().type(params.name);

    if (params.description) {
      this.repository.getDescriptionFieldSelector().clear().type(params.description);
    }

    this.repository.getSaveButton().click();
  };
}
