import { BaseError } from '../../_common/BaseError';

class DomainError extends BaseError {}

export class SignatureError extends DomainError {}
