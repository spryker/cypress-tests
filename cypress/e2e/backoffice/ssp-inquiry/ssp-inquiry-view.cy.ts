import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { SspInquiryStaticFixtures, SspInquiryDynamicFixtures } from '@interfaces/backoffice';
import { SspInquiryDetailPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'ssp inquiry management',
  {
    tags: [
      '@ssp',
      '@backoffice',
      '@sspInquiryManagement',
      'ssp-inquiry-management',
      ' self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const sspInquiryDetailPage = container.get(SspInquiryDetailPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: SspInquiryStaticFixtures;
    let dynamicFixtures: SspInquiryDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('user can approve ssp inquiry', (): void => {
      sspInquiryDetailPage.visit({
        qs: {
          'id-ssp-inquiry': dynamicFixtures.generalSspInquiry.id_ssp_inquiry,
        },
      });

      sspInquiryDetailPage.approveSspInquiry();
      sspInquiryDetailPage.getSspInquiryStatus().contains('Approved');
    });
  }
);
