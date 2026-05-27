import { container } from '@utils';
import { SspInquiryCreatePage, SspInquiryListPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SspInquirySmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that corresponding S3 bucker exists in the infra of the env
 */
describe(
  'ssp inquiry create',
  {
    tags: [
      '@smoke',
      '@ssp',
      '@ssp-inquiry',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    if (!Cypress.env('ENV_IS_SSP_ENABLED')) {
      it.skip('skipped because SSP is not enabled', () => {});
      return;
    }

    const sspInquiryCreatePage = container.get(SspInquiryCreatePage);
    const sspInquiryListPage = container.get(SspInquiryListPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: SspInquirySmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('customer should be able to create an inquiry with an image attachment', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      sspInquiryCreatePage.visit();

      staticFixtures.generalSspInquiry.availableTypes = staticFixtures.sspInquiryTypes.general;
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      cy.contains(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      cy.contains(staticFixtures.generalSspInquiry.subject).should('exist');
    });
  }
);
