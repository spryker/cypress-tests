import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import {YvesPage} from '@pages/yves';
import { SspDashboardManagementRepository } from './ssp-dashboard-management-repository';
import {GlossaryPlaceholders, GlossaryPlaceholderTranslations} from "../../../types/yves";

@injectable()
@autoWired
export class SspDashboardPage extends YvesPage {
  @inject(REPOSITORIES.SspDashboardManagementRepository) private repository: SspDashboardManagementRepository;

  protected PAGE_URL = '/customer/dashboard';

  assertSspDashboardUserInfoPresent = (): void => {
    this.repository.getUserInfoBlock().should('exist');
  };

  assertSspDashboardUserInfoHasWelcomeText = (name: string): void => {
    this.repository.getWelcomeBlock().contains('Welcome, ' + name).should('exist');
  };

  assertSspDashboardUserInfoHasCompanyName = (name: string): void => {
    this.repository.getWelcomeBlock().contains(name).should('exist');
  };

  assertSspDashboardUserInfoHasCompanyBusinessUnitName = (name: string): void => {
    this.repository.getWelcomeBlock().contains(name).should('exist');
  };

  assertSspDashboardHasOverviewBlock = (): void => {
    this.repository.getOverviewBlock().contains(this.repository.getOverviewTitle()).should('exist');
  };

  assertSspDashboardHasStatsOverviewBlock = (): void => {
    this.repository.getStatsColumnBlocks()
        .should('have.length', 2)
        .each(($statsBlock, $index) => {
          cy.wrap($statsBlock)
            .find('div[data-qa="stats-column-title"]').contains(this.repository.getExpectedStatsColumnBlocks()[$index]);
          cy.wrap($statsBlock)
            .find('strong[data-qa="stats-column-counter"]').contains('n/a');
        });
  };

  assertSspDashboardHasSalesRepresentativeBlock = (translations: GlossaryPlaceholders[], idLocale: number): void => {
    this.repository.getSalesRepresentativeBlocks().should('exist');

    translations.forEach(translation => {
      translation.translations.forEach((glossaryPlaceholder: GlossaryPlaceholderTranslations) => {
        if (glossaryPlaceholder.fk_locale === idLocale) {
          this.repository.getSalesRepresentativeBlocks().contains(glossaryPlaceholder.translation);
        }
      })
    })
  };
}
