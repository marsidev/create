import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'

export const ensureDir = (path: string) => {
	mkdirSync(path, { recursive: true })
}

export const dirExists = (path: string) => {
	return existsSync(path)
}

export const validFilename = (filename: string) => {
	const blackList = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']

	if (blackList.some(chr => filename.includes(chr))) {
		return false
	}

	return true
}

export const createEmptyFile = (filename: string) => {
	writeFileSync(filename, '')
}

export const remove = (filename: string) => {
	rmSync(filename, { recursive: true, force: true })
}
