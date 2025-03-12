import { TransferObject } from '../domain/UserTransferRequest';
import { SignatureError } from '../domain/_DomainErrors';
import { IBridgeRepo } from '../ports/IBridgeRepo';
import { Config } from '../ports/IConfigPort';

export class ReceiveNewTransferObjectUseCase {
  constructor(
    private config: Config,
    private bridgeRepo: IBridgeRepo,
  ) {}

  async handle(transferObject: TransferObject): Promise<void> {
    try {
      const bridge = await this.bridgeRepo.get();
      await bridge.addTransferObject(transferObject);
    } catch (e) {
      if (e instanceof SignatureError) return;
      console.error(e);
      throw e;
    }
  }
}
