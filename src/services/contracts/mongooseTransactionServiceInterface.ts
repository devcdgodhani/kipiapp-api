import { ClientSession } from "mongoose";

export interface IMongooseTransactionService {
  start(): Promise<ClientSession>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getSession(): ClientSession | null;
}
