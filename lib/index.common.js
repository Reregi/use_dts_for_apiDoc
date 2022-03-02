'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * [generateFormalApi 生成api接口]
 */
function generateFormalApi(request) {
    return new Proxy({}, {
        /**
         * 拦截指令，改为调用请求方法并返回promise
         * @param   {[{}}]}  target
         * @param   {[string]}  cmd     [key cmd接口命名]
         *
         * @return  {[type]}          [return description]
         */
        get: (target, cmd) => {
            //返回对应方法
            return (...args) => {
                if (cmd) {
                    return request({ cmd, args });
                }
                else {
                    return Promise.reject(new Error("cmd is undefined"));
                }
            };
        },
    });
}

/**
 * [request 请求方法]
 */
function request(data) {
    //根据自己项目所用的request库，返回promise
    return Promise.resolve(data);
}

//创建FormalApi接口
const FormalApi = generateFormalApi(request);
//#region 枚举 
var userType;
(function (userType) {
    // 管理员
    userType["ADMIN"] = "0";
    // 普通用户
    userType["NORMAL"] = "1";
})(userType || (userType = {}));
var timeType;
(function (timeType) {
    // AM
    timeType["AM"] = "0";
    // PM
    timeType["PM"] = "1";
})(timeType || (timeType = {}));
//#endregion

var ApiDemo = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FormalApi: FormalApi,
  get userType () { return userType; },
  get timeType () { return timeType; }
});

const Api = {
    ApiDemo,
};

exports.ApiDemo = ApiDemo;
exports["default"] = Api;
