import * as vscode from 'vscode'
import Provider from './provider'
import readFile from './readFile'
import traverse from './traverse'

export function activate(context: vscode.ExtensionContext) {
	const LANS = ['less', 'scss'];
	const config = vscode.workspace.getConfiguration('test')
	const pathArray: string[] = config.variableFilePath
	
	Promise.all(pathArray.map(path => readFile(path)))
		.then(traverse)
		.then(traverseObject => {
			const provider = new Provider(traverseObject)
			for (let lan of LANS) {
				let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
				context.subscriptions.push(providerDisposable);
			}
		})
}

export function deactivate() {}
