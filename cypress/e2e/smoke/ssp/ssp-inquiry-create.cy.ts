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
    tags: ['@smoke', '@ssp', '@ssp-inquiry', 'spryker-core'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
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

      if (staticFixtures.generalSspInquiry.availableTypes) {
        sspInquiryCreatePage
          .getTypeOptions()
          .should('have.length', staticFixtures.generalSspInquiry.availableTypes.length);
        staticFixtures.generalSspInquiry.availableTypes.forEach((type, index) => {
          sspInquiryCreatePage.getTypeOptions().eq(index).should('have.value', type.key);
        });
      }
      sspInquiryCreatePage.createSspInquiry(staticFixtures.generalSspInquiry);

      sspInquiryCreatePage.assertBodyContainsText(sspInquiryCreatePage.getSspInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      sspInquiryListPage.assertBodyContainsText(staticFixtures.generalSspInquiry.subject).should('exist');
    });
  }
);
