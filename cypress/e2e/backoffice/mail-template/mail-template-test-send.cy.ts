import { container } from '@utils';
import { MailTemplatePreviewPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MailTemplateTestSendDynamicFixtures, MailTemplateTestSendStaticFixtures } from '@interfaces/backoffice';

describe(
  'mail template test send',
  {
    tags: ['@backoffice', '@mail-template', 'mail-template', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the MailTemplate module ships in the suite demoshop only', (): void => {});

      return;
    }

    const mailTemplatePreviewPage = container.get(MailTemplatePreviewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MailTemplateTestSendStaticFixtures;
    let dynamicFixtures: MailTemplateTestSendDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands([staticFixtures.scanCommand]);
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      mailTemplatePreviewPage.visitForMailType(staticFixtures.editableMailType);
    });

    it('backoffice user with the send permission should see the test send form', (): void => {
      mailTemplatePreviewPage.getTestSendForm().should('be.visible');
      mailTemplatePreviewPage.getRecipientEmailInput().should('have.attr', 'type', 'email');
    });

    it('backoffice user should be able to send a test mail to a recipient address', (): void => {
      // TestSendController::sendAction answers JSON; delivery itself is asserted by the module's
      // functional tests with a stubbed transport, never here.
      cy.intercept('POST', '**/mail-template/test-send/send**').as('mailTemplateTestSend');

      mailTemplatePreviewPage.sendTestMail(staticFixtures.recipientEmail);

      cy.wait('@mailTemplateTestSend').then((interception): void => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.deep.include({ isSuccessful: true });
        expect(interception.response?.body.errors).to.deep.eq([]);
      });
    });
  }
);
