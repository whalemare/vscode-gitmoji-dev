import { exec } from 'shelljs';
import * as vscode from 'vscode';
import * as execa from 'execa';
import { stdout } from 'process';

export async function stage(cwd: string, logger: vscode.OutputChannel): Promise<void> {
  const hasSmartCommitEnabled =
    vscode.workspace
      .getConfiguration('git')
      .get<boolean>('enableSmartCommit') === true;

  if (hasSmartCommitEnabled) {
    const hasStaged = await hasStagedFiles(cwd, logger);
    if (hasStaged) {
      logger.appendLine("Don't stage all, because has already staged files");
    } else {
      logger.appendLine(
        'Staging all files (enableSmartCommit enabled with nothing staged)'
      );
      const result = await execa('git', ['add', '.'], {
        cwd
      });
      logger.appendLine(`Output of: ${result.command}; ${result.stdout}`);
    }
  } else {
    logger.appendLine("enableSmartCommit is false, so don't stage any file");
  }
}

async function hasStagedFiles(cwd: string, logger: vscode.OutputChannel): Promise<boolean> {
  const result = await execa('git', ['diff', '--name-only', '--cached'], {
    cwd
  });

  return Boolean(result && result.stdout);
}