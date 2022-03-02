// ApiDemo 接口合集
declare namespace ApiDemo {
  //#region Api接口
  interface RequestApi {
    /**
     * [cmd Api指令]
     *
     * @param {String} param1 参数1
     * @param {String} param2 参数2
     * @return {ApiDemo.user}
     */
    ["cmd"](
      // 参数1
      param1: String,
      // 参数2
      param2: String
    ): Promise<ApiDemo.user>;

    /**
     * [cmd2 Api指令2]
     *
     * @param {String} param3 参数3
     * @param {Number} param4 参数4
     * @return {ApiDemo.user}
     */
    ["cmd2"](
      // 参数3
      param3: String,
      // 参数4
      param4: Number
    ): Promise<ApiDemo.user>;
  }
  //#endregion

  //#region 类型
  /**
   * user
   */
  export type user = {
    // 名称
    name: string;
    // 密码
    password: string;
  };

  /**
   * time
   */
  export type time = {
    // 时
    hour: string;
    // 分
    min: string;
  };

  //#endregion

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

  //#region Api接口
  /**
   * [FormalApi 正式API接口]
   */
  const FormalApi: RequestApi;
  //#endregion
}
export default ApiDemo;
