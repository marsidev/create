import { describe, expect, it } from 'vitest'
import pkgJson from '../package.json'
import { cliOptions as opts, run } from './helpers'

describe('basic commands', () => {
	it.each(opts.author.cmd)(opts.author.desc, async cmd => {
		const { stdout } = await run([cmd])
		expect(stdout).toContain('Marsiglia')
	})

	it('should returns color codes by default', async () => {
		const { stdout } = await run(['--author'])
		expect(stdout).toContain('\u001b')
	})

	it('should not returns color codes when executed with --nocolors', async () => {
		const { stdout } = await run(['--author', '--nocolors'])
		expect(stdout).not.toContain('\u001b')
	})

	it.each(opts.version.cmd)(opts.version.desc, async cmd => {
		const { stdout } = await run([cmd])
		expect(stdout).toContain(pkgJson.version)
	})

	it.each(opts.help.cmd)(opts.help.desc, async cmd => {
		const { stdout } = await run([cmd])
		expect(stdout).toContain('create <file(s)> [options]')
		expect(stdout).toContain('-a, --author')
		expect(stdout).toContain('-b, --base')
		expect(stdout).toContain('-s, --silent')
		expect(stdout).toContain('--nocolors')
		expect(stdout).toContain('-v, --version')
		expect(stdout).toContain('-h, --help')
		expect(stdout).toContain('Basic usage')
		expect(stdout).toContain('Creating multiple files')
		expect(stdout).toContain('Usage with option "base"')
	})
})
