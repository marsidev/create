import type { LogOptions } from './types'
import { join, parse } from 'node:path'
import pc from 'picocolors'
import { createEmptyFile, dirExists, ensureDir, validFilename } from './utils/fs'
import { cli } from './utils/cli'
import { error, success, warn } from './utils/log'
import resolved from './utils/resolve-command'

export const init = () => {
	if (resolved()) return

	const logOptions: LogOptions = {
		silent: cli.silent,
		noColors: cli.nocolors
	}

	cli._.forEach(file => {
		createFile(file.toString())
	})

	function createFile(filename: string) {
		let filenamePath = join(filename)

		if (cli.base) {
			filenamePath = join(cli.base, filename)
		}

		const parsed = parse(filenamePath)

		if (filename.length > 255) {
			error('Filename is too long!', logOptions)
			return
		}

		if (dirExists(filename)) {
			warn(`File ${pc.cyan(filename)} already exists`, logOptions)
			return
		}

		if (!validFilename(parsed.base)) {
			error(`${pc.cyan(parsed.base)} is not a valid filename`, logOptions)
			return
		}

		parsed.dir && ensureDir(parsed.dir)

		try {
			createEmptyFile(filenamePath)
			success(`File ${pc.cyan(filenamePath)} created`, logOptions)
		} catch (e) {
			error(`Something went wrong while creating the file ${pc.cyan(filename)}`, logOptions)
			console.log(e)
		}
	}
}
