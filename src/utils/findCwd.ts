import { exec } from 'shelljs';
import * as vscode from 'vscode';

export async function findCwd(): Promise<string | undefined> {
  let ws = '';
  if (!vscode.workspace.workspaceFolders) {
    return undefined;
  } else if (vscode.workspace.workspaceFolders.length > 1) {
    const repositories: {[key in string] : {label: string, description: string}} = {};
    vscode.workspace.workspaceFolders.forEach(
      (folder: vscode.WorkspaceFolder) => {
        repositories[folder.name] = {
          label: folder.name,
          description: folder.uri.fsPath
        };
      }
    );

    const pickOptions: vscode.QuickPickOptions = {
      placeHolder: 'Select a folder',
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true
    };
    const pick = await vscode.window.showQuickPick<vscode.QuickPickItem>(
      Object.values(repositories),
      pickOptions
    );

    if (pick) {
      ws = repositories[pick.label].description;
    }
  } else {
    ws = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  let gitRoot = undefined;
  if (gitRoot === undefined) {
    gitRoot = await new Promise<string>((resolve, reject) =>
      exec(
        'git rev-parse --show-toplevel',
        { cwd: ws },
        (err, stdout, stderr) => {
          if (err) {
            reject({ err, stderr });
          } else if (stdout) {
            // channel.appendLine(`Found git root at: ${stdout}`);
            resolve(stdout.trim());
          } else {
            reject({ err: 'Unable to find git root' });
          }
        }
      )
    ).catch((e) => {
      // channel.appendLine(e.err.toString());
      // if (e.stderr) {
      //   channel.appendLine(e.stderr.toString());
      // }
      return undefined;
    });
  }

  return ws;
}