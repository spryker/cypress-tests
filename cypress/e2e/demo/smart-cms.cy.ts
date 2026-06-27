import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartCmsPage } from '@pages/backoffice';
import { SmartCmsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Smart CMS - Back Office CMS content assistant panel',
  {
    tags: ['@demo', '@smart-cms', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const smartCmsPage = container.get(SmartCmsPage);

    let staticFixtures: SmartCmsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      smartCmsPage.enableSmartCms();
    });

    it('Smart CMS panel renders on the CMS Page placeholder editor (page loads HTTP 200)', (): void => {
      smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', 'Smart CMS Content Assistant');
    });

    it('Smart CMS panel also renders on the CMS Block glossary editor, with its inline config present', (): void => {
      smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible');

      cy.window().its('SmartCmsContentConfig').should('be.an', 'object');
    });

    it('clicking the panel toggle makes the prompt input, the Ask AI button and the attach control visible', (): void => {
      smartCmsPage.visitCmsPageEditor();

      smartCmsPage.getPanelInput().should('exist');
      smartCmsPage.getPanelAsk().should('exist');
      smartCmsPage.getPanelAttach().should('exist');

      smartCmsPage.getPanelToggle().click();

      smartCmsPage
        .getPanelInput()
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Ask AI to generate or edit the title and content…');
      smartCmsPage.getPanelAsk().should('be.visible').and('contain.text', 'Ask AI');
      smartCmsPage.getPanelAttach().should('be.visible');
    });
  }
);
