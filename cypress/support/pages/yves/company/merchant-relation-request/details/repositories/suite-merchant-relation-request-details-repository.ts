import { injectable } from 'inversify';
import { MerchantRelationRequestDetailsRepository } from '../merchant-relation-request-details-repository';

@injectable()
export class SuiteMerchantRelationRequestDetailsRepository implements MerchantRelationRequestDetailsRepository {}
