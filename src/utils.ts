import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'
import { traverseParams } from './traverse'

// 获取实际路径
export function getPath(url: string): string {
  const root = vscode.workspace.rootPath!
  // 绝对路径
  if(/^\w:/.test(url)) {
    url = url.replace(/^(\w:)(.*)/, (_, a, b) => a.toLowerCase() + b)
  }
  return path.join(root, url.replace(root, ''))
}


export function readFile(filePath: string): Thenable<traverseParams> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, body) => {
      if (err) reject(err)
      const extname = path.extname(filePath).split('.')[1];
      resolve({ body, extname })
    })
  })
}
