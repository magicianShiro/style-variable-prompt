import * as vscode from 'vscode';

export default class Provider implements vscode.CompletionItemProvider {
  private variableObject: { [key: string]: string }
  private reverseVariableObject: { [key: string]: string }
  private inputReg: RegExp
  
  constructor(variableObject: { [key: string]: string }) {
    this.variableObject = variableObject
    this.reverseVariableObject = this.reverseObject(variableObject)
    this.inputReg = /:\s*(.*)/
  }

  provideCompletionItems (
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]>  {
      return new Promise((resolve, reject) => {
        const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
        const inputValue = this.convert(lineText)
        if(!inputValue) return resolve([])
        
        const fileterVariableObjectKey = Object.keys(this.variableObject).filter(variableKey => {
          return variableKey.startsWith(inputValue)
        })
        const fileterVariableObjecValue = Object.values(this.variableObject).filter(variableValue => {
          return variableValue.startsWith(inputValue)
        })

        if (fileterVariableObjectKey.length !== 0) {
          const itemArray = this.createCompletionItem(fileterVariableObjectKey, this.variableObject)
          return resolve(itemArray);
        } else if (fileterVariableObjecValue.length !== 0) {
          const itemArray = this.createCompletionItem(fileterVariableObjecValue, this.reverseVariableObject)
          return resolve(itemArray);
        } else {
          return resolve([]);
        }
    });
  }

  convert(text: string) {
    let match = this.inputReg.exec(text)
    if (!match) return '';
    return match[1].trim()
  }

  reverseObject(object: { [key: string]: string }) {
    return Object.keys(object).reduce((prev: { [key: string]: string }, key) => {
      prev[object[key]] = key
      return prev
    }, {})
  }

  createCompletionItem(keyArray: string[], originObject: { [key: string]: string }) {
    return keyArray.reduce((prev: vscode.CompletionItem[], key) => {
      const keyToKey = new vscode.CompletionItem(`${key} => ${key}`, vscode.CompletionItemKind.Snippet);
      const keyToValue = new vscode.CompletionItem(`${key} => ${originObject[key]}`, vscode.CompletionItemKind.Snippet);
      keyToKey.insertText = key + ';'
      keyToValue.insertText = originObject[key] + ';'
      prev.push(keyToKey, keyToValue)
      return prev
    }, [])
  }
}
