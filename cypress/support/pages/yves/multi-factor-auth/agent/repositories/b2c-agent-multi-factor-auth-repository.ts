import { injectable } from 'inversify';
import { B2cMultiFactorAuthRepository } from '../../repositories/b2c-multi-factor-auth-repository';

@injectable()
export class B2cAgentMultiFactorAuthRepository extends B2cMultiFactorAuthRepository {}
