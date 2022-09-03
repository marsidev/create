#!/usr/bin/env node

import path from 'path'
import { cyan } from 'picocolors'
import { createEmptyFile, ensureDir, fileExists, validFilename } from './utils/fs'
import { cli } from './utils/cli'
import { type LogOptions, error, log, success, warn } from './utils/log'

const main = () => {
	if (Object.keys(cli).length <= 3 && cli._.length === 0) {
		const cmd = cyan(`${cli.$0} --help`)
		warn(`No filenames provided. Use the command "${cmd}" for help`)
		return
	}

	const logOptions: LogOptions = {
		silent: cli.silent,
		noColors: cli.nocolors
	}

	if (cli.author) {
		const options: LogOptions = { ...logOptions, silent: false }
		log(`Name: ${cyan('Luis Marsiglia')}`, options)
		log(`GitHub: ${cyan('https://github.com/marsidev')}`, options)
		log(`Twitter: ${cyan('https://twitter.com/marsigliacr')}`, options)
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
			warn(`File ${cyan(filename)} already exists`, logOptions)
			return
		}

		if (!validFilename(parsed.base)) {
			error(`${cyan(parsed.base)} is not a valid filename`, logOptions)
			return
		}

		parsed.dir && ensureDir(parsed.dir)

		try {
			createEmptyFile(filenamePath)
			success(`File ${cyan(filenamePath)} created`, logOptions)
		} catch (e) {
			error(`Something went wrong while creating the file ${cyan(filename)}`, logOptions)
			console.log(e)
		}
	}
}

main()
