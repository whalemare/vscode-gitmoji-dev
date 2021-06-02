import * as vscode from 'vscode';
import { strings } from '../locale/strings';
import {selectOneOf} from '../utils/selectOneOf';
import {findCwd} from '../utils/findCwd';
import {gitmojis} from './../assets/gitmoji.json';
import {exec} from 'shelljs';
import { cwd } from 'process';
import { stage } from '../utils/stage';
import * as execa from 'execa';

export async function commit(logger: vscode.OutputChannel) {
  const emoji = await selectOneOf(strings.selectEmoji, gitmojis.map(it => ({
    label: it.emoji,
    description: it.code,
    detail: it.description,
  })));

  if (!emoji) {
    logger.appendLine("Not select emoji, just close selection");
    return;
  }

  const title = await vscode.window.showInputBox({
    title: `${emoji?.label} ${emoji.description}`,
    prompt: emoji.detail,
    placeHolder: strings.enterTitleCommitMessage,
    value: `${emoji.label} `,
    ignoreFocusOut: true,
    valueSelection: [emoji.label.length + 1, emoji.label.length + 1],
  });

  const description = await vscode.window.showInputBox({
    title: title,
    prompt: emoji.detail,
    placeHolder: strings.enterDescriptionCommitMessage,
    value: ``,
    ignoreFocusOut: true,
  });

  const message = [title, description].filter(it => it).join("\n\n").trim().replace("\"", "\\\"");
  if (message){
    const cwd = await findCwd();
    if (!cwd) {
      logger.appendLine("cwd not detected, close commitment");
      return;
    } else {
      logger.appendLine(`Find cwd: ${cwd}`);
    }
    stage(cwd, logger);
    try {
      const command = `git commit -m "${message}"`;
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