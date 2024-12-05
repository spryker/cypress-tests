import { autoWired } from '@utils';
import { HomePage } from '@pages/yves';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class SelectStoreScenario {
  @inject(HomePage) private homePage: HomePage;

  execute = (storeName: string): void => {
    this.homePage.visit();
    this.homePage.waitTillStoreAvailable(storeName);
    this.homePage.selectStore(storeName);
  };
}
