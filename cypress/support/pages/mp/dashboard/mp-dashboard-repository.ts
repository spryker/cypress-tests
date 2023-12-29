import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class MpDashboardRepository {}
