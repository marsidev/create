import type { SyncOptions } from 'execa'
import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import { execa } from 'execa'
import { remove } from '../src/utils/fs'

// const CLI_PATH = join(__dirname, '../dist/index.mjs')
// const CLI_PATH = join(__dirname, '../src/index.ts')

export const run = async (args: string[], options: SyncOptions = {}) => {
	// return await execa(`node "${CLI_PATH}" ${args.join(' ')}`, options)
	// return await execa(`node_modules/.bin/tsx "${CLI_PATH}" ${args.join(' ')}`, options)
	return await execa(`node_modules/.bin/tsx src/index.ts ${args.join(' ')}`, options)
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
