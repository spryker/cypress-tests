import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ServicePointListPage, ServicePointViewPage } from '@pages/backoffice';
import {
  ServicePointManagementDynamicFixtures,
  ServicePointManagementStaticFixtures,
} from '../../../support/types/backoffice/service-point-management';

describe(
  'Service Points - Back Office screens',
  {
    tags: ['@backoffice', '@service-point', 'service-points', 'click-and-collect', 'spryker-core-back-office'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped due to it being enabled for the suite repository only', () => {});

      return;
    }

    const servicePointListPage = container.get(ServicePointListPage);
    const servicePointViewPage = container.get(ServicePointViewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ServicePointManagementStaticFixtures;
    let dynamicFixtures: ServicePointManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('renders the service point list with address, stores and service types', (): void => {
      servicePointListPage.visit();

      servicePointListPage.getAddressColumn().should('exist');
      servicePointListPage.getStoresColumn().should('exist');
      servicePointListPage.getServiceTypesColumn().should('exist');

      servicePointListPage.findByKey(dynamicFixtures.servicePoint.key);

      servicePointListPage
        .getTableRows()
        .should('contain', dynamicFixtures.servicePoint.name)
        .and('contain', `${staticFixtures.servicePointAddress.zipCode} ${staticFixtures.servicePointAddress.city}`)
        .and('contain', dynamicFixtures.store.name)
        .and('contain', dynamicFixtures.serviceType.name);
      servicePointListPage
        .getViewButton()
        .should('have.attr', 'href')
        .and('contain', `id-service-point=${dynamicFixtures.servicePoint.id_service_point}`);
    });

    it('renders the service point detail page with its address, services and connected offers', (): void => {
      servicePointViewPage.visitServicePoint(dynamicFixtures.servicePoint.id_service_point);

      servicePointViewPage.getNameContainer().should('contain', dynamicFixtures.servicePoint.name);
      servicePointViewPage.getKeyContainer().should('contain', dynamicFixtures.servicePoint.key);
      servicePointViewPage.getStoresContainer().should('contain', dynamicFixtures.store.name);
      servicePointViewPage
        .getAddressContainer()
        .should(
          'contain',
          `${staticFixtures.servicePointAddress.address1} ${staticFixtures.servicePointAddress.address2}`
        )
        .and('contain', `${staticFixtures.servicePointAddress.zipCode} ${staticFixtures.servicePointAddress.city}`);
      servicePointViewPage
        .getServicesTable()
        .should('contain', dynamicFixtures.serviceType.name)
        .and('contain', dynamicFixtures.service.key);
      servicePointViewPage
        .getConnectedOffersSection()
        .should('contain', dynamicFixtures.productOffer.product_offer_reference)
        .and('contain', dynamicFixtures.product.sku);
    });
  }
);
