import { join, parse } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createEmptyFile, dirExists, remove } from '../src/utils/fs'
import { removeColors } from '../src/utils/log'
import { cleanup, cliOptions as opts, run } from './helpers'

describe('creating files', () => {
	beforeAll(() => cleanup())
	afterAll(() => cleanup())

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

	it.each(opts.base.cmd)(opts.base.desc, async cmd => {
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
	})

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
})
