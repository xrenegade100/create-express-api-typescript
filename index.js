#! /usr/bin/env node
const { spawn } = require('child_process');

const name = process.argv[2];

const VALID_DIR_NAME = /[<>:"\/\\|?*\x00-\x1F]/;

if (!name || name.match(VALID_DIR_NAME))
	return console.log(`
  Invalid directory name.
  Usage: create-express-api-typescript <name-of-api>  
`);

const repoURL =
	'https://github.com/xrenegade100/express-api-starter-typescript';

runCommand('git', ['clone', repoURL, name])
	.then(() => {
		return runCommand('rm', ['-rf', `${name}/.git`]);
	})
	.then(() => {
		console.log('Installing dependencies...');
		return runCommand('npm', ['install'], {
			cwd: process.cwd() + '/' + name
		});
	})
	.then(() => {
		console.log('Done! 🏁');
		console.log('');
		console.log('To get started:');
		console.log('cd', name);
		console.log('npm run dev');
	});

function runCommand(command, args, options = undefined) {
	const spawned = spawn(command, args, { ...options, shell: true });

	return new Promise((resolve) => {
		spawned.stdout.on('data', (data) => {
			console.log(data.toString());
		});

		spawned.stderr.on('data', (data) => {
			console.error(data.toString());
		});

		spawned.on('close', () => {
			resolve();
		});
	});
}
