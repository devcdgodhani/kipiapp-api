import { CategoryModel } from '../../db/postgreSql';
import { SequelizeCommonService } from '../concrete/sequelizeCommonService';

export interface ICategoryService extends SequelizeCommonService<CategoryModel> {}
