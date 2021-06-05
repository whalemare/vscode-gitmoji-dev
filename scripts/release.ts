/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { execSync } from 'child_process';
import { env } from 'process';
import {version} from './../package.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const github = require('gh-release');

async function main() {
  if (!env['GITHUB_TOKEN']) {
    throw new Error('Specify GITHUB_TOKEN environment variable at: https://github.com/settings/tokens');
  }

  execSync('yarn changelog');
  execSync(`git commit -a -m "🚀 Release v${version}"`);
  execSync(`git tag -a v${version} -m "v${version}"`);
  execSync('git push --follow-tags');

  github(
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
