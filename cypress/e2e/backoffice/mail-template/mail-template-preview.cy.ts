import { container } from '@utils';
import { MailTemplateManagePage, MailTemplatePreviewPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MailTemplatePreviewDynamicFixtures, MailTemplatePreviewStaticFixtures } from '@interfaces/backoffice';

describe(
  'mail template preview',
  {
    tags: ['@backoffice', '@mail-template', 'mail-template', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the MailTemplate module ships in the suite demoshop only', (): void => {});

      return;
    }

    const mailTemplateManagePage = container.get(MailTemplateManagePage);
    const mailTemplatePreviewPage = container.get(MailTemplatePreviewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MailTemplatePreviewStaticFixtures;
    let dynamicFixtures: MailTemplatePreviewDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands([staticFixtures.scanCommand]);
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('the editor preview tab should frame the rendered body in a sandboxed iframe', (): void => {
      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);
      mailTemplateManagePage.openTab(MailTemplateManagePage.TAB_PREVIEW);

      mailTemplateManagePage.getPreviewFrame().should('be.visible');
      mailTemplateManagePage
        .getPreviewFrame()
        .should('have.attr', 'sandbox')
        .and('eq', staticFixtures.expectedIframeSandbox)
        .and('not.include', staticFixtures.forbiddenIframeSandboxToken);
      mailTemplateManagePage
        .getPreviewFrame()
        .should('have.attr', 'src')
        .and('include', '/mail-template/preview/render');
    });

    it('the preview page should frame the rendered body in a sandboxed iframe', (): void => {
      mailTemplatePreviewPage.visitForMailType(staticFixtures.editableMailType);

      mailTemplatePreviewPage.getPreviewFrame().should('be.visible');
      // PreviewController::IFRAME_SANDBOX grants allow-same-origin and nothing else — without
      // allow-scripts the merchant-authored body cannot execute JavaScript in the Back Office.
      mailTemplatePreviewPage
        .getPreviewFrame()
        .should('have.attr', 'sandbox')
        .and('eq', staticFixtures.expectedIframeSandbox)
        .and('not.include', staticFixtures.forbiddenIframeSandboxToken);
      mailTemplatePreviewPage
        .getPreviewFrame()
        .should('have.attr', 'src')
        .and('include', '/mail-template/preview/render');
    });

    it('the preview page should offer the html and the plain text part separately', (): void => {
      mailTemplatePreviewPage.visitForMailType(staticFixtures.editableMailType);

      mailTemplatePreviewPage.getTemplatePartLink('html').should('exist');
      mailTemplatePreviewPage.getTemplatePartLink('text').should('exist');
    });
  }
);
