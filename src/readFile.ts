import * as path from 'path'
import * as fs from 'fs'
import { traverseParams } from './traverse'

export default function readFile(filePath: string): Thenable<traverseParams> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, body) => {
      if (err) reject(err)
      const extname = path.extname(filePath).split('.')[1];
      resolve({ body, extname })
    })
  })
}
