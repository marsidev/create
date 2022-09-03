import { existsSync, mkdirSync, writeFileSync } from 'fs'

export const ensureDir = (path: string) => {
	mkdirSync(path, { recursive: true })
}

export const fileExists = (path: string) => {
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
