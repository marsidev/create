import { Command } from 'commander'
import pkgJson from '../../package.json'
const program = new Command()

program
	.name('create')
	.version(pkgJson.version ?? '1.0.0')
	.option('-a, --author', 'Show info about the author of this library')
	.option('-b, --base <string>', 'Base folder to place the file(s)')
	.option('-s, --silent', 'Hide logs when creating file(s)')
	.option('-v, --version', 'Show version number')
	.option('--nocolors', 'Disable colorized logs')
	.addHelpText(
		'after',
		`

Examples:
  $ create index.ts\t\tBasic usage
  $ create src/index.ts\t\tCreating a nested file
  $ create index.html style.css app.js\t\tCreating multiple files
  $ create --base src/components Navbar.tsx Footer.tsx\t\tUsage with option "base"
	`
	)
	.parse(process.argv)

export default program
