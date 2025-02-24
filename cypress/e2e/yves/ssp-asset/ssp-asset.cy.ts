import { container } from '@utils';
import { SspAssetCreatePage } from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'ssp asset management',
    { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
    (): void => {
        const assetCreatePage = container.get(SspAssetCreatePage);
        const customerLoginScenario = container.get(CustomerLoginScenario);

        let staticFixtures: SspAssetStaticFixtures;
        let dynamicFixtures: SspAssetDynamicFixtures;

        before((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());
        });

        it('should create an asset successfully', () => {
            customerLoginScenario.execute({
                email: dynamicFixtures.customer.email,
                password: staticFixtures.defaultPassword,
                withoutSession: true,
            });

            assetCreatePage.visit();

            assetCreatePage.createAsset({name: staticFixtures.asset.name});

            cy.contains(assetCreatePage.getAssetCreatedMessage());
        });
    }
);
