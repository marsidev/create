import type { LogOptions } from '../types'
import pc from 'picocolors'
import { cli } from './cli'
import { currentVersion, requiredVersion, validNodeVersion } from './node'
import { error, log, warn } from './log'

const resolved = () => {
	if (!validNodeVersion()) {
		error(`You are running Node ${currentVersion}.\nThis package requires Node ${requiredVersion} or higher.\nPlease update your version of Node.`)
		return true
	}

	const cliOptionKeys = Object.keys(cli)
	const thereIsFiles = cli._.length > 0
	const thereIsParams = cliOptionKeys.length > 2

	const logOptions: LogOptions = {
		silent: cli.silent,
		noColors: cli.nocolors
	}

	if (cli.author) {
		// $ create --author
		const options: LogOptions = { ...logOptions, silent: false }
		log(`Name: ${pc.cyan('Luis Marsiglia')}`, options)
		log(`GitHub: ${pc.cyan('https://github.com/marsidev')}`, options)
		log(`Twitter: ${pc.cyan('https://twitter.com/marsigliacr')}`, options)
		return true
	}

	if (cliOptionKeys.includes('base') && !thereIsFiles) {
		// $ create --base
		const cmd = pc.cyan(`${cli.$0} --help`)
		const expected = pc.cyan('create --base {basePath} file1 file2')
		warn(
			`You used "base" option but no filenames were provided\nExpected syntax is ${expected}\nUse the command "${cmd}" for more help`
		)
		return true
	}

	if (!thereIsParams && !thereIsFiles) {
		// $ create
		const cmd = pc.cyan(`${cli.$0} --help`)
		warn(
			`No filenames or parameters were provided. Use the command "${cmd}" for help`
		)
		return true
	}

	if (thereIsParams && !cli.base && !thereIsFiles) {
		// create --invalid
		const cmd = pc.cyan(`${cli.$0} --help`)
		warn(`You provided unknown parameters. Use the command "${cmd}" for help`)
		return true
	}

	return false
}

export default resolved
