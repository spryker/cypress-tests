import { injectable } from 'inversify';
import { B2bMpMultiFactorAuthRepository } from '../../repositories/b2b-mp-multi-factor-auth-repository';

@injectable()
export class B2bMpAgentMultiFactorAuthRepository extends B2bMpMultiFactorAuthRepository {}
