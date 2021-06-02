import * as vscode from 'vscode';

function getStrings() {
  if (vscode.env.language.includes("ru")) {
    return require('./ru');
  } else {
    return require('./en');
  }
}

export const strings = getStrings();