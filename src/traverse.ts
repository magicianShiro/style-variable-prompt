import strategy, { IStrategy } from './strategy'

export type traverseParams = {
  body: string,
  extname: string
}

export default function traverse(traverseArray: traverseParams[]) {
  const traverseResult = traverseArray.map(traverse => {
    return strategy[traverse.extname as keyof IStrategy].getVariableObject(traverse.body)
  })
  return traverseResult.reduce((prev: { [key: string]: string }, object) => {
    return Object.assign(prev, object)
  }, {})
}