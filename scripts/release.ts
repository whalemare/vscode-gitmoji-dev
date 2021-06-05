/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { execSync } from 'child_process';
import execa = require('execa');
import { env } from 'process';
import {version} from './../package.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const github = require('gh-release');

async function main() {
  if (!env['GITHUB_TOKEN']) {
    throw new Error('Specify GITHUB_TOKEN environment variable at: https://github.com/settings/tokens');
  }

  await execa('yarn', ['gitmoji-changelog']);
  await execa(`git`, ['commit', '-a', '-m', `"🚀 Release v${version}"`]);
  await execa(`git`, [`tag`, `-a`, `v${version}`, `-m`, `v${version}`]);
  await execa('git', ['push', '--follow-tags']);

  await github(
    {
      tag_name: `v${version}`,
      name: `v${version}`,
      draft: false,
      prerelease: true,
      auth: {
        token: env['GITHUB_TOKEN'],
      },
    },
    (err: any, result: any) => {
      if (err) {throw err;}
      console.log(result);
    },
  );
}

void main();
