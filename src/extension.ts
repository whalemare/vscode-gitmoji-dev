import * as vscode from 'vscode';
import { commit } from './commands/commit';

export function activate(context: vscode.ExtensionContext) {
	const channel = vscode.window.createOutputChannel("gitmoji-dev");

	context.subscriptions.push(
		vscode.commands.registerCommand('gitmoji-dev.commit', () => {
			commit(channel, { mode: 'emoji' });
		}),
		vscode.commands.registerCommand('gitmoji-dev.commit-code', () => {
			commit(channel, { mode: 'code' });
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
