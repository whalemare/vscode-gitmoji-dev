import { exec } from 'shelljs';
import * as vscode from 'vscode';
import * as execa from 'execa';

export async function stage(cwd: string, logger: vscode.OutputChannel): Promise<void> {
  const hasSmartCommitEnabled =
    vscode.workspace
      .getConfiguration('git')
      .get<boolean>('enableSmartCommit') === true;

  if (hasSmartCommitEnabled && !(await hasStagedFiles(cwd))) {
    logger.appendLine(
      'Staging all files (enableSmartCommit enabled with nothing staged)'
    );
    await execa('git', ['add', '.'], {
      cwd
    });
  }
}

async function hasStagedFiles(cwd: string): Promise<boolean> {
  const result = execa('git', ['diff', '--name-only', '--cached'], {
    cwd
  });

  return !!result && !!result.stdout;
}