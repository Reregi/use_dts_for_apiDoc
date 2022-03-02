/**
 * [RequestFunc 定义请求方法]
 */
type RequestFunc = (data: { cmd: string; args: any[] }) => Promise<any>;

/**
 * [generateFormalApi 生成api接口]
 */
export function generateFormalApi(request: RequestFunc) {
  return new Proxy(
    {},
    {
      /**
       * 拦截指令，改为调用请求方法并返回promise
       * @param   {[{}}]}  target
       * @param   {[string]}  cmd     [key cmd接口命名]
       *
       * @return  {[type]}          [return description]
       */
      get: (target: {}, cmd: string) => {
        //返回对应方法
        return (...args: any[]): Promise<any> => {
          if (cmd) {
            return request({ cmd, args });
          } else {
            return Promise.reject(new Error("cmd is undefined"));
          }
        };
      },
    }
  );
}
