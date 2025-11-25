import { ORDER_NUMBER_START } from '../../constants';
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
  generateUniqueOrderNumber = async (): Promise<string> => {
    let number = ORDER_NUMBER_START;
    const exist = await this.findOne({}, { sort: { createdAt: -1 } });
    if (exist) number = Number(exist.number);
    return `${(number + 1).toString()}`;
  };
}
