# use_dts_for_apiDoc

根据后端给出的文档，生成对应 json 文件，输出声明文件，利用 typescript 的声明文件充当 API 文档。

## 一、使用方法

**使用接口时，根据声明文件都会有 ide 的智能提示**

- 请求接口使用

```typescript
import { ApiDemo } from "use-dts-for-apiDoc";

ApiDemo.FormalApi["cmd"]("name", "pwd")
  .then((res) => {
    // 请求成功的处理
  })
  .catch((err) => {
    // 请求失败的处理
  })
  .finally();
```

- 类型查询

```typescript
import { ApiDemo } from "use-dts-for-apiDoc";

// 类型
const user: ApiDemo.user = {
  user: "name",
  password: "pw",
};
// 枚举
const admin = ApiDemo.userType.ADMIN;
```

## 二、原理

**_调用接口时候，根据声明文件会提示输入这样的方法_**

```typescript
ApiDemo.FormalApi["cmd"]("name", "pwd");
```

> **实际调用接口的时候，运行的是 generateFormalApi 这个方法，利用 Proxy 拦截了 FormalApi 的 cmd 命令 调用 request 方法。** > **返回 request 方法可以根据自己项目要求去写**

```typescript
// src/core/core.ts
/**
 * [generateFormalApi 生成FormalApi]
 */
function generateFormalApi(request: RequestFunc) {
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

// src/request.ts
/**
 * [request 请求方法]
 */
function request(data: { cmd: string; args: any[] }) {
  //根据自己项目所用的request库，返回promise
  return Promise.resolve(data);
}
```

## 三、生成对应声明

**根据 json 生成对应定义。cli/utils.js 有提供三种的解析函数**

> **_每个后端项目不一样，对应文档也不一样，JSON 数据也不一样，解析函数可以根据自己的项目进行修改_**

### api 接口定义

```json
{
  "name": "cmd",
  "doc": "Api指令",
  "result": "ApiDemo.user",
  "params": [
    { "name": "param1", "doc": "参数1", "type": "String" },
    { "name": "param2", "doc": "参数2", "type": "String" }
  ]
}
```

```typescript
/**
  * [cmd Api指令]
  *
  * @param {String} param1 参数1
  * @param {String} param2 参数2
  * @return {ApiDemo.user}
  */
  ['cmd'](
  // 参数1
  param1: String,
  // 参数2
  param2: String
 ): Promise<ApiDemo.user>;

```

### type 类型定义

```json
{
    "name": "user",
    "text": {
      "url": "com.apiDemo.user",
      "data": [
        { "doc": "名称", "type": "string", "name": "name" },
        { "doc": "密码", "type": "string", "name": "password" }
      ]
    }
  },
```

```typescript
/**
 * user
 */
export type user = {
  // 名称
  name: string;
  // 密码
  password: string;
};
```

### enum 枚举定义

```json
{
    "name": "userType",
    "text": {
      "url": "com.apiDemo",
      "data": [
        { "doc": "管理员", "name": "ADMIN", "type": "0" },
        { "doc": "普通用户", "name": "NORMAL", "type": "1" }
      ]
    }
  },
```

```typescript
export enum userType {
  // 管理员
  ADMIN = "0",
  // 普通用户
  NORMAL = "1",
}
```

## 四、生成对应 api.ts

> src
> ├─ ApiDemo Api 集合-一套 Api 项目一个文件夹
> │ ├─ api.ts 声明 FormalApi 方法，声明 enum 枚举并导出
> │ └─ index.ts 导入 api 内的方法与枚举，并导出
> ├─ core
> │ └─ core.ts
> ├─ index.ts 导入 Api，并且统一导出
> └─ request.ts 存放请求 http 方法

## 五、整合

### 整合代码

生成对应.d.ts，对应 Api 集合文件后，在 index.d.ts,index.ts 文件要进行导入导出。

```typescript
//index.d.ts
import ApiDemo from "./ApiDemo";
export { ApiDemo };
declare const Api: {
  ApiDemo;
};
export default Api;

//index.ts
import ApiDemo from "./ApiDemo";
export { ApiDemo };
const Api = {
  ApiDemo,
};
export default Api;
```

### 打包

使用 rollup 打包

> package.json 写了对应脚本 "lib": "rollup -c"
> 运行 npm run lib
> 即可进行编译 ts 并打包

### 测试

使用 npm link

> 本项目运行 npm link
> 到测试项目中 npm link "本项目名"
> 本项目的会目录链接到测试项目的 node_modules 中
> 测试项目引入进行测试

### 发布

> ...

## 六、类型转换规则

根据后端语言类型-来制订转换规则，utils的方法也只是基本的转换，但是没有类型转换。
可以先从JSON文本数据转换后，再生成声明文件。
以 JAVA 为例

### 数字类型

**`short` `int` `long` `float` `double` 可以转成 `number`**

### 字符串类型

**`String` 可以转成 `string`**

### Map类型
**key只能是`number`或者`string`,`Map<number: string> => { [key: number]: string }`**

### 模糊定义
**转换成`any`**

### 数组
**`List<array>` => `array[]`**
**`List<List<array>>` => `array[][]`**