import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspModelAddPage, SspModelUpdatePage, SspModelViewPage, SspModelListPage } from '@pages/backoffice/';
import { SspModelManagementStaticFixtures, SspModelManagementDynamicFixtures } from '@interfaces/backoffice';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp model creation',
  { tags: ['@backoffice', '@sspModelManagement', '@ssp'] },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const sspModelAddPage = container.get(SspModelAddPage);
    const sspModelUpdatePage = container.get(SspModelUpdatePage);
    const sspModelViewPage = container.get(SspModelViewPage);
    const sspModelListPage = container.get(SspModelListPage);

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

    it('should be able to create a new ssp model', () => {
      sspModelListPage.visit();

      sspModelListPage.clickCreateButton();

      sspModelAddPage.assertPageLocation();

      sspModelAddPage.fillSspModelForm({
        name: staticFixtures.sspModel.name,
        code: staticFixtures.sspModel.code,
        image: staticFixtures.sspModel.image,
      });

      sspModelAddPage.submitForm();

      sspModelAddPage.verifySuccessMessage();

      sspModelListPage.visit();

      sspModelListPage.verifyModelInTable({
        name: staticFixtures.sspModel.name,
        code: staticFixtures.sspModel.code,
      });
    });

    it('should be able to edit a model and persist changes', () => {
      sspModelUpdatePage.visit({
        qs: {
          'id-ssp-model': dynamicFixtures.sspModel.id_ssp_model,
        },
      });

      sspModelUpdatePage.fillSspModelForm({
        code: staticFixtures.sspModelEdit.code,
      });

      sspModelUpdatePage.submitForm();

      sspModelUpdatePage.verifySuccessMessage();

      sspModelViewPage.visit({
        qs: {
          'id-ssp-model': dynamicFixtures.sspModel.id_ssp_model,
        },
      });

      sspModelViewPage.assertPageLocation();

      sspModelViewPage.verifySspModel({
        code: staticFixtures.sspModelEdit.code,
      });
    });
  }
);
