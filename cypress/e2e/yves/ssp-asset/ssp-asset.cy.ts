import { container } from '@utils';
import { SspAssetCreatePage, SspAssetEditPage } from '@pages/yves';
import { SspAssetStaticFixtures, SspAssetDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'ssp asset management',
    { tags: ['@yves', '@ssp-asset', '@ssp', '@sspAssetManagement'] },
    (): void => {
        const assetCreatePage = container.get(SspAssetCreatePage);
        const assetEditPage = container.get(SspAssetEditPage);
        const customerLoginScenario = container.get(CustomerLoginScenario);

        let staticFixtures: SspAssetStaticFixtures;
        let dynamicFixtures: SspAssetDynamicFixtures;

        before((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());
        });

        beforeEach(() => {
            customerLoginScenario.execute({
                email: dynamicFixtures.customer.email,
                password: staticFixtures.defaultPassword,
                withoutSession: true,
            });
        });

        it('should create an asset successfully', () => {
            assetCreatePage.visit();

            assetCreatePage.createAsset({name: staticFixtures.asset.name});

            cy.contains(assetCreatePage.getAssetCreatedMessage());
        });

        it('should update an asset successfully', () => {
            cy.log(dynamicFixtures.asset.reference);
            assetEditPage.visit({
                qs: {
                    reference: dynamicFixtures.asset.reference,
                }
            })

            assetEditPage.editAsset({
                name: 'new asset name',
            });

            cy.contains(assetEditPage.getAssetEditedMessage());
        });
    }
);
