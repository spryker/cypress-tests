import { autoWired } from '@utils';
import { HomePage } from '@pages/yves';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class SelectStoreScenario {
  @inject(HomePage) private HomePage: HomePage;

  execute = (storeName: string): void => {
    this.HomePage.visit();
    this.HomePage.selectStore(storeName);
  };
}
