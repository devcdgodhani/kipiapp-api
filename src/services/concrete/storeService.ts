import { StoreModel } from "../../db/postgreSql";
import { IStoreService } from "../contracts";
import { SequelizeCommonService } from "./sequelizeCommonService";

export class StoreService
  extends SequelizeCommonService<StoreModel>
  implements IStoreService
{
  constructor() {
    super(StoreModel);
  }
}
