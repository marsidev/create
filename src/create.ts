import type { LogOptions } from './types'
import { join, parse } from 'node:path'
import pc from 'picocolors'
import {
	createEmptyFile,
	dirExists,
	ensureDir,
	validFilename
} from './utils/fs'
import { cli } from './utils/cli'
import { currentVersion, requiredVersion, validNodeVersion } from './utils/node'
import { error, log, success, warn } from './utils/log'

export const init = () => {
	if (!validNodeVersion()) {
		error(`You are running Node ${currentVersion}.\nThis package requires Node ${requiredVersion} or higher.\nPlease update your version of Node.`)
		return
	}

	if (Object.keys(cli).length <= 3 && cli._.length === 0) {
		const cmd = pc.cyan(`${cli.$0} --help`)
		warn(`No filenames provided. Use the command "${cmd}" for help`)
		return
	}

	const logOptions: LogOptions = {
		silent: cli.silent,
		noColors: cli.nocolors
	}

	if (cli.author) {
		const options: LogOptions = { ...logOptions, silent: false }
		log(`Name: ${pc.cyan('Luis Marsiglia')}`, options)
		log(`GitHub: ${pc.cyan('https://github.com/marsidev')}`, options)
		log(`Twitter: ${pc.cyan('https://twitter.com/marsigliacr')}`, options)
		return
	}

	const files = cli._
	files.forEach(file => {
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
