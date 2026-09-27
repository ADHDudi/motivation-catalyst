#!/usr/bin/env node
// Runs the Playwright E2E suite after asking which environment to target.
//
//   npm run test:e2e                 → prompts for local / production
//   npm run test:e2e -- prod         → skips the prompt
//   npm run test:e2e -- local --project=chromium   → extra args go to Playwright

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const ENVS = {
  local: { label: 'Local (dev server on http://localhost:5188)', baseURL: 'http://localhost:5188' },
  prod: { label: 'Production (https://motivation-catalyst-david.web.app)', baseURL: 'https://motivation-catalyst-david.web.app' },
};

const ALIASES = { local: 'local', l: 'local', '1': 'local', prod: 'prod', production: 'prod', p: 'prod', '2': 'prod' };

const args = process.argv.slice(2);
let env = ALIASES[args[0]?.toLowerCase()];
if (env) args.shift();

if (!env) {
  if (!process.stdin.isTTY) {
    console.error('No environment given and no terminal to prompt in. Use: npm run test:e2e -- local|prod');
    process.exit(1);
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log('Which environment should the E2E tests run against?');
  console.log(`  1) ${ENVS.local.label}`);
  console.log(`  2) ${ENVS.prod.label}`);
  while (!env) {
    const answer = (await rl.question('Choose [1/2]: ')).trim().toLowerCase();
    env = ALIASES[answer];
    if (!env) console.log('Please enter 1 (local) or 2 (production).');
  }
  rl.close();
}

console.log(`\nRunning E2E tests against ${ENVS[env].label}\n`);

const child = spawn('npx', ['playwright', 'test', ...args], {
  stdio: 'inherit',
  env: { ...process.env, BASE_URL: ENVS[env].baseURL },
});
child.on('exit', code => process.exit(code ?? 1));
