import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspFileManagementRepository } from './ssp-file-management-repository';

@injectable()
@autoWired
export class SspFileManagementDownloadPage extends YvesPage {
  @inject(SspFileManagementRepository) private repository: SspFileManagementRepository;

  protected PAGE_URL = '/customer/ssp-file/download';

  downloadFile(params: { fileUuid: string }): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      url: `${Cypress.config('baseUrl')}${this.PAGE_URL}`,
      qs: { 'id-file': params.fileUuid },
      encoding: 'binary',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }

  downloadFileForbidden(params: { fileUuid: string }): Cypress.Chainable<Cypress.Response<unknown>> {
    return cy.request({
      url: `${Cypress.config('baseUrl')}${this.PAGE_URL}`,
      qs: { 'id-file': params.fileUuid },
      failOnStatusCode: false,
      followRedirect: true,
    });
  }
}
