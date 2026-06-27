import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartCmsPage } from '@pages/backoffice';
import { SmartCmsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'smart cms',
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

    it('renders the Smart CMS panel on the CMS Page placeholder editor with HTTP 200', (): void => {
      smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', 'Smart CMS Content Assistant');
    });

    it('renders the Smart CMS panel on the CMS Block glossary editor with inline config defined', (): void => {
      smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible');

      cy.window().its('SmartCmsContentConfig').should('be.an', 'object');
    });

    it('expands the panel on toggle, revealing the prompt input, Ask AI and attach controls', (): void => {
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
