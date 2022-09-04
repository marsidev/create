import type { ExecOptions } from 'node:child_process'
import { join, resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import { exec as execSync } from 'node:child_process'
import { promisify } from 'node:util'
import { remove } from '../src/utils/fs'
import pkgJson from '../package.json'

const PACKAGE_ROOT = resolve(__dirname, '..')
const CLI_PATH = resolve(PACKAGE_ROOT, pkgJson.bin.create)

const exec = promisify(execSync)

export const run = async (args: string[], options: ExecOptions = {}) => {
	return await exec(`node "${CLI_PATH}" ${args.join(' ')}`, {
		...options,
		cwd: PACKAGE_ROOT
	})
}

export const cleanup = () => {
	const allFiles = readdirSync(join(__dirname, '..'))

	allFiles.forEach(f => {
		if (f.startsWith('test-gen__')) {
			console.log(`Removing ${f}`)
			remove(f)
		}
	})
}

export const cliOptions = {
	author: {
		cmd: [['-a'], ['--author']],
		desc: 'should returns the author name when executed with %s'
	},
	version: {
		cmd: [['-v'], ['--version']],
		desc: 'should returns current version when executed with %s'
	},
	help: {
		cmd: [['-h'], ['--help']],
		desc: 'should returns the available options when executed with %s'
	},
	base: {
		cmd: [['-b'], ['--base']],
		desc: 'can create files with %s option'
	}
}
