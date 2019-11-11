import * as vscode from 'vscode'
import Provider from './provider'
// import readFile from './readFile'
import traverse, { LAN, classification } from './traverse'
import { getPath, readFile } from './utils'

export function activate(context: vscode.ExtensionContext) {
	const LANS: Array<LAN> = ['less', 'scss'];
	const config = vscode.workspace.getConfiguration('styleVariablePrompt')
	const pathArray: string[] = config.variableFilePath
	
	Promise.all(pathArray.map(path => readFile(getPath(path))))
		.then(classification)
		.then(traverse)
		.then(traverseObject => {
			for (let lan of LANS) {
				const provider = new Provider(traverseObject[lan])
				let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
				context.subscriptions.push(providerDisposable);
			}
		})
}

export function deactivate() {}
