import { autoWired } from '@utils';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../backoffice-page';

@injectable()
@autoWired
export class IndexPage extends BackofficePage {
  protected PAGE_URL: string = '/';
}
