import { container } from '@utils';
import { GlossaryManagementDynamicFixtures, GlossaryManagementStaticFixtures } from '@interfaces/backoffice';
import { GlossaryFormPage, GlossaryListPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'glossary management',
  { tags: ['@backoffice', 'glossary', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const glossaryListPage = container.get(GlossaryListPage);
    const glossaryFormPage = container.get(GlossaryFormPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: GlossaryManagementStaticFixtures;
    let dynamicFixtures: GlossaryManagementDynamicFixtures;

    // A key of its own for the update, so the test never edits a translation the storefront renders.
    let existingGlossaryKey: string;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());

      existingGlossaryKey = `${staticFixtures.glossaryKeyPrefix}.existing.${Date.now()}`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      glossaryListPage.visit();
      glossaryListPage.clickCreateTranslation();
      glossaryFormPage.create({ glossaryKey: existingGlossaryKey, translation: staticFixtures.translation });
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a new glossary key when a translation is created for it then the glossary lists the key', (): void => {
      // Arrange
      // Drawn per attempt, so a retry does not collide with the key its previous attempt created.
      const glossaryKey = `${staticFixtures.glossaryKeyPrefix}.${Date.now()}`;
      glossaryListPage.visit();

      // Act
      glossaryListPage.clickCreateTranslation();
      glossaryFormPage.create({ glossaryKey: glossaryKey, translation: staticFixtures.translation });

      // Assert
      glossaryListPage.visit();
      glossaryListPage.findTranslation(glossaryKey).should('contain.text', glossaryKey);
    });

    it('given an existing glossary key when its translation is updated then every locale shows the new translation', (): void => {
      // Arrange
      glossaryListPage.visit();
      glossaryListPage.edit(existingGlossaryKey);

      // Act
      glossaryFormPage.update(staticFixtures.updatedTranslation);

      // Assert
      glossaryListPage.visit();
      glossaryListPage.edit(existingGlossaryKey);
      glossaryFormPage.getLocaleTextareas().each(($textarea) => {
        cy.wrap($textarea).should('have.value', staticFixtures.updatedTranslation);
      });
    });
  }
);
