import { CategoryModel } from '../../db/postgreSql';
import { ICategoryService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class CategoryService
  extends SequelizeCommonService<CategoryModel>
  implements ICategoryService
{
  constructor() {
    super(CategoryModel);
  }
}
