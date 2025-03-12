import { Bridge } from '../domain/Bridge';

export interface IBridgeRepo {
  save(bridge: Bridge): Promise<void>;
  get(): Promise<Bridge>;
}
