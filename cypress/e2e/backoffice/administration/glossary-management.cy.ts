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

    // A key of its own per run, so the test never edits a translation the storefront renders.
    let glossaryKey: string;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
      glossaryKey = `${staticFixtures.glossaryKeyPrefix}.${Date.now()}`;
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should create a translation and list it', (): void => {
      // Arrange
      glossaryListPage.visit();

      // Act
      glossaryListPage.clickCreateTranslation();
      glossaryFormPage.create({ glossaryKey: glossaryKey, translation: staticFixtures.translation });

      // Assert
      glossaryListPage.visit();
      glossaryListPage.findTranslation(glossaryKey).should('contain.text', glossaryKey);
    });

    it('should update the translation of an existing key', (): void => {
      // Arrange
      glossaryListPage.visit();
      glossaryListPage.edit(glossaryKey);

      // Act
      glossaryFormPage.update(staticFixtures.updatedTranslation);

      // Assert
      glossaryListPage.visit();
      glossaryListPage.edit(glossaryKey);
      glossaryFormPage.getLocaleTextareas().each(($textarea) => {
        cy.wrap($textarea).should('have.value', staticFixtures.updatedTranslation);
      });
    });
  }
);
