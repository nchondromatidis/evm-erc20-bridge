import { TransferObject, UserTransferRequest } from '../domain/UserTransferRequest';
import { SignatureError } from '../domain/_DomainErrors';
import { IBridgeRepo } from '../ports/IBridgeRepo';

export class ReceiveNewTransferObject {
  constructor(private bridgeRepo: IBridgeRepo) {}

  async handle(transferObject: TransferObject): Promise<void> {
    try {
      const bridge = await this.bridgeRepo.get();
      const userTransferRequest = new UserTransferRequest(transferObject);
      bridge.addTransferObject(userTransferRequest);
    } catch (e) {
      if (e instanceof SignatureError) return;
      console.error(e);
      throw e;
    }
  }
}
