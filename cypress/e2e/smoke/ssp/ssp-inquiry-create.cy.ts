import { container } from '@utils';
import { SspInquiryCreatePage, SspInquiryListPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SspInquiryCreateSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe(
  'ssp inquiry create',
  { tags: ['@smoke', '@ssp-inquiry', 'ssp-inquiry', 'spryker-core'] },
  (): void => {
    const sspInquiryCreatePage = container.get(SspInquiryCreatePage);
    const sspInquiryListPage = container.get(SspInquiryListPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: SspInquiryCreateSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('customer should be able to create an inquiry with an image attachment', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      sspInquiryCreatePage.visit();

      sspInquiryCreatePage.createInquiry({
        subject: staticFixtures.inquiry.subject,
        message: staticFixtures.inquiry.message,
        file: staticFixtures.inquiry.file,
      });

      cy.contains(sspInquiryCreatePage.getInquiryCreatedMessage()).should('exist');

      sspInquiryListPage.visit();
      cy.contains(staticFixtures.inquiry.subject).should('exist');
    });
  }
);
