import { container } from '@utils';
import { CmsPage } from '@pages/yves';

(['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
    'index page',
    { tags: ['@index page'] },
    (): void => {
        const cmsPage = container.get(CmsPage);

    before((): void => {
        Cypress.env();
    });

    beforeEach((): void => {
        cmsPage.visit();
    });

    it('featured products are visible', (): void => {
        cy.contains(cmsPage.getFeaturedProductsBlockTitle());
        cmsPage.getProductSelector().should('exist');
    });
});
