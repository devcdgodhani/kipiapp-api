import mongoose, { ClientSession } from 'mongoose';
import { IMongooseTransactionService } from '../contracts/mongooseTransactionServiceInterface';

export class MongooseTransactionService implements IMongooseTransactionService {
  private session: ClientSession | null = null;

  start = async (): Promise<ClientSession> => {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    return this.session;
  };

  commit = async (): Promise<void> => {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = null;
    }
  };

  rollback = async (): Promise<void> => {
    if (this.session) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.session = null;
    }
  };

  getSession = (): ClientSession | null => {
    return this.session;
  };
}
