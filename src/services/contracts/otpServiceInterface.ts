import { OtpModel } from "../../db/postgreSql";
import { SequelizeCommonService } from "../concrete/sequelizeCommonService";

export interface IOtpService extends SequelizeCommonService<OtpModel> {}
