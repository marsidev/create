import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pc from 'picocolors'

const program = yargs(hideBin(process.argv))

export const cli = program
	.scriptName('create')
	.option('author', {
		alias: 'a',
		type: 'boolean',
		describe: 'Show info about the author of this library'
	})
	.option('base', {
		alias: 'b',
		type: 'string',
		describe: 'Base folder to place the file(s)'
	})
	.option('silent', {
		alias: 's',
		type: 'boolean',
		describe: 'Hide logs when creating file(s)'
	})
	.option('nocolors', {
		type: 'boolean',
		describe: 'Disable colorized logs'
	})
	.alias('v', 'version')
	.alias('h', 'help')

	.usage(pc.cyan('$0 <command> [options]'))
	.example('create index.ts', 'Basic usage')
	.example('', '')
	.example('create src/index.ts', 'Creating a nested file')
	.example('', '')
	.example('create index.html style.css app.js', 'Creating multiple files')
	.example('', '')
	.example(
		'create --base src/components Navbar.tsx Footer.tsx',
		'Usage with option "base"'
	)
	.wrap(120)
	.help()
	.parseSync()
