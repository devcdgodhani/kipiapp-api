import { SubCategoryModel } from "../../db/postgreSql";
import { SequelizeCommonService } from "../concrete/sequelizeCommonService";

export interface ISubCategoryService extends SequelizeCommonService<SubCategoryModel> {}
