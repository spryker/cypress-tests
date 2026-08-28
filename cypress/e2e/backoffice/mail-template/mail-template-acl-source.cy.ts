import { container } from '@utils';
import { MailTemplateManagePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MailTemplateAclSourceDynamicFixtures, MailTemplateAclSourceStaticFixtures } from '@interfaces/backoffice';

describe(
  'mail template acl gated source view',
  {
    tags: ['@backoffice', '@mail-template', 'mail-template', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the MailTemplate module ships in the suite demoshop only', (): void => {});

      return;
    }

    const mailTemplateManagePage = container.get(MailTemplateManagePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MailTemplateAclSourceStaticFixtures;
    let dynamicFixtures: MailTemplateAclSourceDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands([staticFixtures.scanCommand]);
    });

    // The positive case is what keeps the negative case honest: without it, a renamed panel selector
    // would make the "does not exist" assertion pass for the wrong reason.
    it('backoffice user with the raw source rule should see the template code panel', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);

      mailTemplateManagePage.getSourcePanel().should('exist');
    });

    it('backoffice user without the raw source rule should not see the template code panel', (): void => {
      // The fixture grants mail-template index/*, manage/index, manage/save and manage/publish, but
      // never manage/source — the rule MailTemplateAccessChecker::canAuthorRawTwig() checks.
      userLoginScenario.execute({
        username: dynamicFixtures.editorWithoutSourceUser.username,
        password: staticFixtures.restrictedUserPassword,
      });

      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);

      cy.url().should('include', '/mail-template/manage');
      cy.url().should('not.include', '/acl/index/denied');
      mailTemplateManagePage.getForm().should('exist');
      mailTemplateManagePage.getSourcePanel().should('not.exist');
    });
  }
);
