import { container } from '@utils';
import { MailTemplateListPage, MailTemplateManagePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MailTemplateManagementDynamicFixtures, MailTemplateManagementStaticFixtures } from '@interfaces/backoffice';

describe(
  'mail template management',
  {
    tags: ['@backoffice', '@mail-template', 'mail-template', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the MailTemplate module ships in the suite demoshop only', (): void => {});

      return;
    }

    const mailTemplateListPage = container.get(MailTemplateListPage);
    const mailTemplateManagePage = container.get(MailTemplateManagePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MailTemplateManagementStaticFixtures;
    let dynamicFixtures: MailTemplateManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // The catalogue table reads spy_mail_template_definition, which the demoshop install recipe
      // does not populate; `mail-template:scan` is the documented post-install step (INSTALLATION.md).
      cy.runCliCommands([staticFixtures.scanCommand]);
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should see the registered mail types in the catalogue', (): void => {
      mailTemplateListPage.waitForTable();

      mailTemplateListPage.getTableBody().should('contain', staticFixtures.editableMailType);
    });

    it('backoffice user should be able to open a mail type in the editor from the list', (): void => {
      mailTemplateListPage.waitForTable();
      mailTemplateListPage.clickEditForMailType(staticFixtures.editableMailType);

      cy.url().should('include', '/mail-template/manage');
      cy.url().should('include', encodeURIComponent(staticFixtures.editableMailType));

      mailTemplateManagePage.getForm().should('exist');
      mailTemplateManagePage.getHtmlBodyTextarea().should('exist');

      mailTemplateManagePage.openTab(MailTemplateManagePage.TAB_SUBJECT);
      mailTemplateManagePage.getSubjectInput().should('be.visible');

      mailTemplateManagePage.openTab(MailTemplateManagePage.TAB_SETTINGS);
      mailTemplateManagePage.getStoreNameSelect().should('be.visible');
      mailTemplateManagePage.getLocaleNameSelect().should('be.visible');
    });

    it('backoffice user should be able to narrow the catalogue to overridden mail types only', (): void => {
      mailTemplateListPage.waitForTable();
      mailTemplateListPage.getOverriddenOnlyCheckbox().check();

      cy.url().should('include', 'overridden-only=1');
      mailTemplateListPage.getOverriddenOnlyCheckbox().should('be.checked');
      // No override exists for this mail type: the fixtures create none and the editor save path is
      // not wired yet (see the skipped round-trip below), so the filtered catalogue excludes it.
      mailTemplateListPage.getTableBody().should('not.contain', staticFixtures.editableMailType);
    });

    // The Save button has no `action`: `mail-template-form.js` reads the endpoint off the form's
    // `data-save-url` and posts to `/mail-template/manage/save` (JSON) in the background, so the
    // assertion is a real round trip through ManageController::saveAction.
    it('backoffice user should be able to change the HTML body and see it persisted', (): void => {
      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);
      mailTemplateManagePage.replaceHtmlBody(staticFixtures.newHtmlBody);
      mailTemplateManagePage.save();

      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);
      mailTemplateManagePage.getEditorArea().should('contain', staticFixtures.newHtmlBody);
    });
  }
);
