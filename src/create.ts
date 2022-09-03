import type { LogOptions } from './types'
import path from 'path'
import pc from 'picocolors'
import {
	createEmptyFile,
	ensureDir,
	fileExists,
	validFilename
} from './utils/fs'
import { cli } from './utils/cli'
import { error, log, success, warn } from './utils/log'

export const init = () => {
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
		let filenamePath = path.join(filename)

		if (cli.base) {
			filenamePath = path.join(cli.base, filename)
		}

		const parsed = path.parse(filenamePath)

		if (fileExists(filename)) {
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
