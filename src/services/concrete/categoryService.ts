import { CategoryModel } from '../../db/mongodb';
import { ICategoryAttributes, ICategoryDocument } from '../../interfaces';
import { ICategoryService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';

export class CategoryService
  extends MongooseCommonService<ICategoryAttributes, ICategoryDocument>
  implements ICategoryService
{
  constructor() {
    super(CategoryModel);
  }
}
