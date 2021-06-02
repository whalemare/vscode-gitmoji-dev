import * as vscode from 'vscode';
import { strings } from '../locale/strings';
import {selectOneOf} from '../utils/selectOneOf';
import {findCwd} from '../utils/findCwd';
import {gitmojis} from './../assets/gitmoji.json';
import {exec} from 'shelljs';
import { cwd } from 'process';
import { stage } from '../utils/stage';

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

  const message = [title, description].filter(it => it).join("\n\n");
  if (message){
    const cwd = await findCwd();
    if (!cwd) {
      logger.appendLine("cwd not detected, close commitment");
      return;
    } else {
      logger.appendLine(`Find cwd: ${cwd}`);
    }
    stage(cwd, logger);
    exec(`git commit -a -m "${message}"`, {
      cwd: cwd,
    });
  } else {
    vscode.window.showWarningMessage(`${strings.errorEmptyMessage}: ${message}`);
  }
}