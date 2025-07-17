import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspModelAddPage } from '@pages/backoffice/';
import { SspModelManagementStaticFixtures, SspModelManagementDynamicFixtures } from '@interfaces/backoffice';

(['suite', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp model creation',
  { tags: ['@backoffice', '@modelManagement', '@ssp'] },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const modelAddPage = container.get(SspModelAddPage);

    let staticFixtures: SspModelManagementStaticFixtures;
    let dynamicFixtures: SspModelManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should be able to create a new model', () => {
      modelAddPage.visit();

      modelAddPage.fillModelForm({
        name: staticFixtures.sspModel.name,
        code: staticFixtures.sspModel.code,
        image: staticFixtures.sspModel.image,
      });

      modelAddPage.submitForm();

      modelAddPage.verifySuccessMessage();
    });
  }
);
