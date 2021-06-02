import { exec } from 'shelljs';
import * as vscode from 'vscode';

export async function stage(cwd: string, logger: vscode.OutputChannel): Promise<void> {
  const hasSmartCommitEnabled =
    vscode.workspace
      .getConfiguration('git')
      .get<boolean>('enableSmartCommit') === true;

  if (hasSmartCommitEnabled && !(await hasStagedFiles(cwd))) {
    logger.appendLine(
      'Staging all files (enableSmartCommit enabled with nothing staged)'
    );
    exec('git add .', {
      cwd
    });
  }
}

async function hasStagedFiles(cwd: string): Promise<boolean> {
  const result = exec('git diff --name-only --cached', {
    cwd
  });

  return !!result;
}