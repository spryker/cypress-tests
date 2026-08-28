import { container } from '@utils';
import { MailTemplateManagePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MailTemplateEditorChipsDynamicFixtures, MailTemplateEditorChipsStaticFixtures } from '@interfaces/backoffice';

describe(
  'mail template editor chips',
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

    let staticFixtures: MailTemplateEditorChipsStaticFixtures;
    let dynamicFixtures: MailTemplateEditorChipsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands([staticFixtures.scanCommand]);
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);
    });

    it('backoffice user should be able to insert a variable chip from the editor toolbar', (): void => {
      mailTemplateManagePage.insertFirstVariableChip();

      // The chip contract is MailTemplateConfig::getChipTemplate(): a contenteditable=false span
      // carrying the Twig expression the before-save converter turns back into `{{ ... }}`.
      mailTemplateManagePage.getVariableChips().should('have.length.at.least', 1);
      mailTemplateManagePage
        .getVariableChips()
        .first()
        .should('have.attr', 'data-type', staticFixtures.chipType)
        .and('have.attr', 'contenteditable', 'false');
      mailTemplateManagePage.getVariableChips().first().should('have.attr', 'data-path').and('not.be.empty');
      mailTemplateManagePage.getVariableChips().first().should('have.attr', 'data-twig-expression').and('not.be.empty');
    });

    // This is the assertion that guards MailTemplateConfig::getEditorAllowedAttributes(): if the XSS
    // whitelist drops the chip's data-* attributes on submit, the chip comes back as flat text and
    // the reloaded body loses its variable.
    it('an inserted chip should survive a save and reload as a chip', (): void => {
      mailTemplateManagePage.insertFirstVariableChip();
      mailTemplateManagePage
        .getVariableChips()
        .first()
        .invoke('attr', 'data-path')
        .then((insertedPath) => {
          mailTemplateManagePage.save();

          mailTemplateManagePage.visitForMailType(staticFixtures.editableMailType);

          mailTemplateManagePage.getVariableChips().should('have.length.at.least', 1);
          mailTemplateManagePage.getVariableChips().first().should('have.attr', 'data-path', insertedPath);
          mailTemplateManagePage.getVariableChips().first().should('have.attr', 'contenteditable', 'false');
        });
    });
  }
);
