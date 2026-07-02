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

    it(
      'Smart CMS panel renders on the CMS Page placeholder editor (page loads HTTP 200)',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

        smartCmsPage.getPanel().should('be.visible');
        smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', 'Smart CMS Content Assistant');
      }
    );

    it(
      'Smart CMS panel also renders on the CMS Block glossary editor, with its inline config present',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);

        smartCmsPage.getPanel().should('be.visible');
        smartCmsPage.getPanelToggle().should('be.visible');

        cy.window().its('SmartCmsContentConfig').should('be.an', 'object');
      }
    );

    it(
      'clicking the panel toggle makes the prompt input, the Ask AI button and the attach control visible',
      { tags: ['@demo-smoke'] },
      (): void => {
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
      }
    );

    it('the prompt input accepts typed text after the panel is expanded', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();

      smartCmsPage.typePrompt('Write a punchy hero title for this landing page');
    });

    it(
      'attaching a file via the attach control lists it as an attached item with its file name',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();

        smartCmsPage.attachFile(staticFixtures.probeImagePath);

        smartCmsPage.getPanelAttachmentName().should('have.length', 1).and('contain.text', 'search-by-image-probe.png');
      }
    );

    it(
      'clicking Ask AI issues the generate POST with the typed prompt and recovers gracefully when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();
        smartCmsPage.interceptGenerateWithProviderFailure();

        const prompt = 'Write a punchy hero title for this landing page';
        smartCmsPage.typePrompt(prompt);
        smartCmsPage.clickAskAi();

        cy.wait('@generateRequest').then((interception): void => {
          expect(interception.request.method).to.eq('POST');

          const body = interception.request.body;
          const payload = typeof body === 'string' ? JSON.parse(body) : body;

          expect(payload).to.have.property('userPrompt', prompt);
          expect(payload).to.have.property('entityType', staticFixtures.cmsPageEntityType);
          expect(payload).to.have.property('idEntity', staticFixtures.cmsPageIdEntity);
          expect(payload).to.have.property('_token').that.is.a('string').and.not.empty;
          expect(payload).to.have.property('placeholders');
        });

        smartCmsPage.getPanelMessage().should('have.class', 'smart-cms-panel__message--error').and('be.visible');
        smartCmsPage.getPanelAsk().should('be.visible').and('not.be.disabled');
      }
    );

    it(
      'clicking Ask AI with a file attached includes the attachment in the generate POST payload',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();
        smartCmsPage.interceptGenerateWithProviderFailure();

        smartCmsPage.attachFile(staticFixtures.probeImagePath);
        smartCmsPage.getPanelAttachmentName().should('have.length', 1);

        smartCmsPage.typePrompt('Suggest alt text based on the attached image');
        smartCmsPage.clickAskAi();

        cy.wait('@generateRequest').then((interception): void => {
          const body = interception.request.body;
          const payload = typeof body === 'string' ? JSON.parse(body) : body;

          expect(payload.attachments).to.be.an('array').with.length(1);
          expect(payload.attachments[0]).to.have.property('mediaType', staticFixtures.probeImageMediaType);
          expect(payload.attachments[0]).to.have.property('content').that.is.a('string').and.not.empty;
        });

        smartCmsPage.getPanelMessage().should('be.visible');
      }
    );
  }
);
