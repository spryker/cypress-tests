import { container } from '@utils';
import { ContentMenuDynamicFixtures, ContentMenuStaticFixtures } from '@interfaces/backoffice';
import { ContentMenuPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('content menu', { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] }, (): void => {
  const contentMenuPage = container.get(ContentMenuPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: ContentMenuStaticFixtures;
  let dynamicFixtures: ContentMenuDynamicFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should list only the task-oriented entries under Content', (): void => {
    contentMenuPage.visit();

    contentMenuPage.getContentMenuEntries().should('have.length', staticFixtures.visibleMenuUrls.length);

    staticFixtures.visibleMenuUrls.forEach((url: string): void => {
      contentMenuPage.getMenuLinkByUrl(url).should('be.visible');
    });

    staticFixtures.legacyUrls.forEach((url: string): void => {
      contentMenuPage.getMenuLinkByUrl(url).should('not.exist');
    });
  });

  it('should still open a classic editor that is no longer in the menu', (): void => {
    contentMenuPage.visitLegacyPage(staticFixtures.legacyUrls[0]);

    cy.location('pathname').should('include', staticFixtures.legacyUrls[0]);
    contentMenuPage.getDataTable().should('be.visible');
  });
});
