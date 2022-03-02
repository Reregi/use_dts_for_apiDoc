import { generateFormalApi } from "src/core/core";
import request from "../request";

//创建FormalApi接口
export const FormalApi = generateFormalApi(request);

//#region 枚举
export enum userType {
  // 管理员
  ADMIN = "0",
  // 普通用户
  NORMAL = "1",
}

export enum timeType {
  // AM
  AM = "0",
  // PM
  PM = "1",
}

//#endregion
