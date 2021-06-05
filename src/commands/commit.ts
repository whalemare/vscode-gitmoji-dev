import * as vscode from 'vscode';
import { strings } from '../locale/strings';
import {selectOneOf} from '../utils/selectOneOf';
import {findCwd} from '../utils/findCwd';
import {gitmojis} from './../assets/gitmoji.json';
import {exec} from 'shelljs';
import { cwd } from 'process';
import { stage } from '../utils/stage';
import * as execa from 'execa';
import { replaceAll } from '../utils/replaceAll';

export type CommitProps = {
  mode: "emoji" | "code"
};

export async function commit(logger: vscode.OutputChannel, {mode}: CommitProps) {
  const emoji = await selectOneOf(strings.selectEmoji, gitmojis.map(it => ({
    label: it.emoji,
    description: it.code,
    detail: it.description,
  })));

  if (!emoji) {
    logger.appendLine("Not select emoji, just close selection");
    return;
  }

  const value = `${mode === "emoji" ? emoji.label : emoji.description} `;
  const title = await vscode.window.showInputBox({
    title: `${emoji?.label} ${emoji.description}`,
    prompt: emoji.detail,
    placeHolder: strings.enterTitleCommitMessage,
    value: value,
    ignoreFocusOut: true,
    valueSelection: [value.length, value.length],
  }) || "";

  const message = replaceAll(
    title.trim(),
    "\"",
    "\\\"",
  );
  if (message){
    const cwd = await findCwd();
    if (cwd) {
      logger.appendLine(`Find cwd: ${cwd}`);
    } else {
      logger.appendLine("cwd not detected, close commitment");
      return;
    }
    await stage(cwd, logger);
    try {
      const shellString = await execa('git', ['commit', '-m', `"${message}"`], {
        cwd: cwd,
        shell: vscode.env.shell,
        preferLocal: false,
      });

      logger.appendLine(`Result of execution command ${shellString.command}:\n\n${shellString.stdout}\n\n`);
    }catch(e) {
      logger.appendLine(`Error ${e}`);
      vscode.window.showErrorMessage(e);
    }
  } else {
    vscode.window.showWarningMessage(`${strings.errorEmptyMessage}: ${message}`);
  }
}