import type { SyncOptions } from 'execa'
import { join, parse } from 'node:path'
import { readdirSync } from 'node:fs'
import { randomBytes } from 'crypto'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { execa } from 'execa'
import pkgJson from '../package.json'
import { createEmptyFile, dirExists, remove } from '../src/utils/fs'
import { removeColors } from '../src/utils/log'

const CLI_PATH = join(__dirname, '../dist/index.mjs')

const run = async (args: string[], options: SyncOptions = {}) => {
	return await execa(`node "${CLI_PATH}" ${args.join(' ')}`, options)
}

const cleanup = () => {
	const allFiles = readdirSync(join(__dirname, '..'))

	allFiles.forEach(f => {
		if (f.startsWith('test-gen__')) {
			console.log(`Removing ${f}`)
			remove(f)
		}
	})
}

describe('basic commands', () => {
	it('should returns expected message when no args are passed', async () => {
		const { stdout } = await run([])
		expect(stdout).toContain('No filenames provided.')
	})

	test.each([['-a'], ['--author']])(
		'should returns the author name when executed with %s',
		async cmd => {
			const { stdout } = await run([cmd])
			expect(stdout).toContain('Marsiglia')
		}
	)

	it('should returns color codes by default', async () => {
		const { stdout } = await run(['--author'])
		expect(stdout).toContain('\u001b')
	})

	it('should not returns color codes when executed with --nocolors', async () => {
		const { stdout } = await run(['--author', '--nocolors'])
		expect(stdout).not.toContain('\u001b')
	})

	test.each([['-v'], ['--version']])(
		'should returns current version when executed with %s',
		async cmd => {
			const { stdout } = await run([cmd])
			expect(stdout).toBe(pkgJson.version)
		}
	)

	test.each([['-h'], ['--help']])(
		'should returns the available options when executed with %s',
		async cmd => {
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
		}
	)
})

describe('creating files', () => {
	beforeAll(() => {
		cleanup()
	})

	afterAll(() => {
		cleanup()
	})

	it('can create a single file', async () => {
		const files = ['test-gen__index.ts']
		const [file] = files
		expect(dirExists(file)).toBe(false)

		const { stdout } = await run(files)
		expect(dirExists(file)).toBe(true)
		expect(removeColors(stdout)).toContain(`File ${file} created`)

		remove(file)
	})

	it('can create multiple files', async () => {
		const files = [
			'test-gen__index.html',
			'test-gen__styles.css',
			'test-gen__app.jsx'
		]

		files.forEach(f => expect(dirExists(f)).toBe(false))
		const { stdout } = await run(files)

		files.forEach(f => expect(dirExists(f)).toBe(true))
		files.forEach(f => {
			expect(removeColors(stdout)).toContain(`File ${f} created`)
		})

		files.forEach(f => remove(f))
	})

	it('can create nested files', async () => {
		const files = [
			'test-gen__dir/index.html',
			'test-gen__dir/styles/global.css',
			'test-gen__dir/components/App.jsx'
		]

		files.forEach(f => expect(dirExists(f)).toBe(false))
		const { stdout } = await run(files)

		files.forEach(f => expect(dirExists(f)).toBe(true))
		files.forEach(f => {
			const parsed = parse(f)
			expect(stdout).toContain('File')
			expect(removeColors(stdout)).toContain(`${parsed.base} created`)
		})

		files.forEach(f => remove(f))
	})

	it.each([['-b'], ['--base']])(
		'can create files with %s option',
		async cmd => {
			const files = ['Navbar.tsx', 'Footer.tsx']
			const basePath = 'test-gen__dir/components'

			files.forEach(f => {
				const p = join(basePath, f)
				expect(dirExists(p)).toBe(false)
			})

			const { stdout } = await run([...files, cmd, basePath])

			files.forEach(f => {
				const p = join(basePath, f)
				expect(dirExists(p)).toBe(true)
			})

			files.forEach(f => {
				const p = join(basePath, f)
				const parsed = parse(p)
				expect(stdout).toContain('File')
				expect(removeColors(stdout)).toContain(`${parsed.base} created`)
			})

			files.forEach(f => {
				const p = join(basePath, f)
				remove(p)
			})
		}
	)

	it('does not create an already existing file', async () => {
		const files = ['test-gen__index.ts']
		const [file] = files
		expect(dirExists(file)).toBe(false)

		createEmptyFile(file)
		expect(dirExists(file)).toBe(true)

		const { stdout } = await run(files)
		expect(removeColors(stdout)).toContain(`File ${file} already exists`)

		remove(file)
	})

	it('shows a proper error if a non valid filename is provided', async () => {
		const files = ['test-gen__?index.ts']
		const [file] = files

		const { stdout } = await run(files)
		expect(removeColors(stdout)).toContain(`${file} is not a valid filename`)
		expect(dirExists(file)).toBe(false)
	})

	it('shows a proper error if the filename is too long', async () => {
		const file = randomBytes(128).toString('hex') // each byte encoded to hex is 2 characters

		const { stdout } = await run([file])
		expect(removeColors(stdout)).toContain('Filename is too long!')
		expect(dirExists(file)).toBe(false)
	})
})
