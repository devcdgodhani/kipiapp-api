import { SubCategoryModel } from '../../db/postgreSql';
import { ISubCategoryService } from '../contracts';
import { SequelizeCommonService } from './sequelizeCommonService';

export class SubCategoryService
  extends SequelizeCommonService<SubCategoryModel>
  implements ISubCategoryService
{
  constructor() {
    super(SubCategoryModel);
  }
}
