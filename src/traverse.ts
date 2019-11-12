import strategy, { IStrategy } from './strategy'

export type LAN = 'less' | 'scss'

export type traverseParams = {
  body: string,
  extname: LAN
}

export type classificationResult = {
  [key in LAN]: Array<string>
}

export type traverseResult = {
  [key in LAN]: {
    [key: string]: string
  }
}

/**
 * 给读出的数据按照文件后缀分类
 *
 * @param {traverseParams[]} traverseArray
 * @returns { classificationResult }
 */
export function classification(traverseArray: traverseParams[]) {
  return traverseArray.reduce((prev: classificationResult, traverse) => {
    (prev[traverse.extname] || (prev[traverse.extname] = [])).push(traverse.body)
    return prev
  }, {} as classificationResult)
}

/**
 * 将变量文件读取成键值对形式
 *
 * @export
 * @param {classificationResult} traverseObject
 * @returns {{ scss: [{ key: value }], less: [{ key: value }] }}
 */
export default function traverse (traverseObject: classificationResult) {
  return (Object.keys(traverseObject) as Array<LAN>).reduce((prev: traverseResult, extname) => {
    traverseObject[extname].forEach(body => {
      Object.assign((prev[extname] || (prev[extname] = {})),
      strategy[extname as keyof IStrategy].getVariableObject(body))
    })
    return prev
  }, {} as traverseResult)
}
// /**
//  * 将变量文件读取成键值对形式
//  *
//  * @export
//  * @param {traverseParams[]} traverseArray
//  * @returns {{ scss: [{ key: value }], less: [{ key: value }] }}
//  */
// export default function traverse (traverseArray: traverseParams[]) {

//   const traverseResult = traverseArray.map(traverse => {
//     return strategy[traverse.extname as keyof IStrategy].getVariableObject(traverse.body)
//   })
//   return traverseResult.reduce((prev: { [key: string]: string }, object) => {
//     return Object.assign(prev, object)
//   }, {})
// }