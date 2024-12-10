import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage, HomePage } from '../../pages/yves';

@injectable()
@autoWired
export class LocaleSwitchingScenario {
  @inject(HomePage) private yvesPage: YvesPage;

  execute = (params: ExecuteParams): void => {
    this.yvesPage.assertCurrentLocale(params.currentLocale);
    this.yvesPage.selectLocale(params.selectedLocale.split('_')[0]);
    this.yvesPage.assertCurrentLocale(params.selectedLocale);
  };
}

interface ExecuteParams {
  currentLocale: string;
  selectedLocale: string;
}
