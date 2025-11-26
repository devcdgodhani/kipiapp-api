import { TransactionModel } from '../../db/mongodb';
import { ITransactionAttributes, ITransactionDocument } from '../../interfaces';
import { ITransactionService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class TransactionService
  extends MongooseCommonService<ITransactionAttributes, ITransactionDocument>
  implements ITransactionService
{
  constructor() {
    super(TransactionModel);
  }
}
