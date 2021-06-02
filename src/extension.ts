import * as vscode from 'vscode';
import { commit } from './commands/commit';

export function activate(context: vscode.ExtensionContext) {
	const channel = vscode.window.createOutputChannel("gitmoji-dev");

	let disposable = vscode.commands.registerCommand('gitmoji-dev.commit', () => {
		// The code you place here will be executed every time your command is executed
		commit(channel);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
