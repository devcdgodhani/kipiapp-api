import { ContactAddressModel } from '../../db/mongodb';
import { IContactAddressAttributes, IContactAddressDocument } from '../../interfaces';
import { IContactAddressService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class ContactAddressService
  extends MongooseCommonService<IContactAddressAttributes, IContactAddressDocument>
  implements IContactAddressService
{
  constructor() {
    super(ContactAddressModel);
  }
}
