import { OrderModel } from '../../db/mongodb';
import { IOrderAttributes, IOrderDocument } from '../../interfaces';
import { IOrderService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class OrderService
  extends MongooseCommonService<IOrderAttributes, IOrderDocument>
  implements IOrderService
{
  constructor() {
    super(OrderModel);
  }
}
