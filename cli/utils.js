const fs = require("fs");
/**
 * [generateUtils 构造工具函数]
 */
const generateUtils = {
  /**
   * [generateFormal 创建Api定义]
   *
   * @param   {[object]}  json  [json数据]
   * @return  {[string]}        [return api类型定义]
   */
  generateFormal: (json) => {
    let formalData = "";
    if (json.length > 0) {
      json.forEach((apiInfo) => {
        //注释参数
        let notesParam = ``;
        //函数体参数
        let funcParam = "";
        //循环获取参数
        apiInfo.params.forEach((param, index) => {
          notesParam += `
        * @param {${param.type}} ${param.name} ${param.doc || ""}`;
          funcParam += `
        // ${param.doc || ""}
        ${param.name}: ${param.type}${
            index === apiInfo.params.length - 1 ? "" : ","
          }`;
        });
        formalData += `
      /**
        * [${apiInfo.name} ${apiInfo.doc}]
        *${notesParam}
        * @return {${apiInfo.result}}
        */
        ['${apiInfo.name}'](${funcParam}
       ): Promise<${apiInfo.result}>;
      `;
      });
    }
    return formalData;
  },
  /**
   * [generateType 创建类型定义]
   *
   * @param   {[type]}  json  [json数据]
   * @return  {[string]}        [return 类型支持定义]
   */
  generateType: (json) => {
    let typeData = "";
    if (json.length > 0) {
      json.forEach((typeInfo) => {
        let data = "";
        typeInfo.text.data.map((item) => {
          data += `
        // ${item.doc || ""}
        ${item.name}: ${item.type}`;
          return "";
        });
        typeData += `
      /**
       * ${typeInfo.name}
       */
      export type ${typeInfo.name} = {${data}
      };
      `;
      });
    }
    return typeData;
  },
  /**
   * [generateEnum 创建枚举定义]
   *
   * @param   {[type]}  json  [json数据]
   * @return  {[string]}        [return 枚举支持定义]
   */
  generateEnum: (json) => {
    let enumData = "";
    if (json.length > 0) {
      json.forEach((typeInfo) => {
        let data = "";
        typeInfo.text.data.map((item) => {
          data += `
        // ${item.doc || ""}
        ${item.name} = '${item.type}',`;
          return "";
        });
        enumData += `
      export enum ${typeInfo.name} {${data}
      };
      `;
      });
    }
    return enumData;
  },
  /**
   * [generateDts 创建声明文件]
   *
   * @param   {[type]}  name        [name Api集合名称]
   * @param   {[type]}  formalJSON  [formalJSON JSON数据]
   * @param   {[type]}  typeJSON    [typeJSON JSON数据]
   * @param   {[type]}  enumJSON    [enumJSON JSON数据]
   *
   * @return  {[type]}              [return description]
   */
  generateDts: function (name, formalJSON, typeJSON, enumJSON) {
    fs.writeFileSync(
      `types/${name}.d.ts`,
      `// ${name} 接口合集
    declare namespace ${name} {
      //#region Api接口
      interface RequestApi { ${this.generateFormal(JSON.parse(formalJSON))}
      }
      //#endregion
  
      //#region 类型 ${this.generateType(JSON.parse(typeJSON))}
      //#endregion
  
      //#region 枚举 ${this.generateEnum(JSON.parse(enumJSON))}
      //#endregion
  
      //#region Api接口
      /**
       * [FormalApi 正式API接口]
       */
      const FormalApi: RequestApi;
      //#endregion
    }
    export default ${name};
    `
    );
  },
  /**
   * [generateTs 创建src/Api目录]
   *
   * @param   {[type]}  name  [name Api集合名称]
   * @param   {[type]}  enumJSON    [enumJSON JSON数据]
   *
   * @return  {[type]}        [return description]
   */
  generateTs: function (name,enumJSON) {
    try {
      //新建文件夹
      fs.mkdirSync(`src/${name}`);
      //创建index.ts
      fs.writeFileSync(
        `src/${name}/index.ts`,
        `import * as ${name} from "./api";

    export default ${name};`
      );
      //创建api.ts
      fs.writeFileSync(
        `src/${name}/api.ts`,
        `import { generateFormalApi } from "src/core/core";
         import request from "../request";
      
         //创建FormalApi接口
         export const FormalApi = generateFormalApi(request);
         
         //#region 枚举 ${this.generateEnum(JSON.parse(enumJSON))}
         //#endregion
         `
      );
    } catch (err) {
      console.error(err.errno == -4075 ? "目录已存在" : err);
    }
  },
};

module.exports = generateUtils;
