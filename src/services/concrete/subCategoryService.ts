import { SubCategoryModel } from '../../db/mongodb';
import { ISubCategoryAttributes, ISubCategoryDocument } from '../../interfaces';
import { ISubCategoryService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class SubCategoryService
  extends MongooseCommonService<ISubCategoryAttributes, ISubCategoryDocument>
  implements ISubCategoryService
{
  constructor() {
    super(SubCategoryModel);
  }
}
