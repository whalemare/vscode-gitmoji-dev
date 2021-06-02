import * as vscode from 'vscode';

export async function selectOneOf(
  question: string,
  picks: vscode.QuickPickItem[],
) {
  return vscode.window.showQuickPick(picks, {
    placeHolder: question,
    ignoreFocusOut: true,
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: false,
    title: "Select emoji"
  });
}