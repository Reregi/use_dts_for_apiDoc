/**
 * [request 请求方法]
 */
export default function request(data: { cmd: string; args: any[] }) {
  //根据自己项目所用的request库，返回promise
  return Promise.resolve(data);
}
