import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspFileManagementRepository } from './ssp-file-management-repository';

@injectable()
@autoWired
export class SspFileManagementDownloadPage extends YvesPage {
  @inject(SspFileManagementRepository) private repository: SspFileManagementRepository;

  protected PAGE_URL = '/ssp-file-management/download';

  downloadFile(params: {fileUuid: string}): void {
      cy.request({
          url: `${Cypress.config('baseUrl')}${this.PAGE_URL}`,
          qs: {'id-file': params.fileUuid},
          encoding: 'binary',
          headers: {
              'Content-Type': 'application/octet-stream'
          }
      }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.exist;
      });
  }

  downloadFileForbidden(params: {fileUuid: string}): void
  {
      cy.request({
          url: `${Cypress.config('baseUrl')}${this.PAGE_URL}`,
          qs: {'id-file': params.fileUuid},
          failOnStatusCode: false,
          followRedirect: true
      }).then((response) => {
          expect(response.status).to.eq(200);

          const redirectUrl = response.allRequestResponses?.[response.allRequestResponses.length - 1]?.['Request URL'] || '';
          expect(redirectUrl).to.include('/error-page/404');
      });
  }
}
