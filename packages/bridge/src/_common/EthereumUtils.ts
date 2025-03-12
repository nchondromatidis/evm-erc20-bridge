import { ethers, Wallet } from 'ethers';

export class EthereumUtils {
  static isEthereumSignatureValid(message: string, signature: string, signer: string) {
    const recoveredAddress2 = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress2 === signer;
  }

  static async signMessage(message: string, pk: string) {
    const wallet = new Wallet(pk);
    return wallet.signMessage(message);
  }

  static toWei(amount: string) {
    return ethers.utils.parseUnits(amount, 'gwei');
  }

  static toETH(amount: string) {
    return ethers.utils.parseUnits(amount, 'gwei');
  }
}
