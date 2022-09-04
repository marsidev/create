import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { dirExists } from '../src/utils/fs'
import { removeColors } from '../src/utils/log'
import { run } from './helpers'

describe('errors', () => {
	it('should returns expected message when no args are passed', async () => {
		const { stdout } = await run([])
		expect(stdout).toContain('No filenames or parameters were provided.')
	})

	it('should returns proper error message when using --base option with no filenames', async () => {
		const { stdout } = await run(['--base'])
		expect(stdout).toContain('You used "base" option but no filenames were provided')
	})

	it('should returns proper error message when using unknown parameter', async () => {
		const { stdout } = await run(['--invalid'])
		expect(stdout).toContain('You provided unknown parameters')
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
