import type { LogFn, LogOptions } from '../types'
import pc from 'picocolors'
const { blue, bold, green, red, yellow } = pc

const defaultOptions: LogOptions = {
	silent: false,
	bold: true,
	noColors: false
}

export const removeColors = (msg: string) => {
	return msg.replace(/\u001b[^m]*?m/g, '')
}

export const log: LogFn = (msg, opts = defaultOptions) => {
	if (opts.silent) return

	if (opts.noColors) {
		return console.log(removeColors(msg))
	}

	if (opts.bold || opts.bold === undefined) {
		return console.log(bold(msg))
	}

	console.log(msg)
}

export const info: LogFn = (msg, opts = defaultOptions) => log(blue(msg), opts)

export const success: LogFn = (msg, opts = defaultOptions) => log(green(msg), opts)

export const warn: LogFn = (msg, opts = defaultOptions) => log(yellow(msg), opts)

export const error: LogFn = (msg, opts = defaultOptions) => log(red(msg), { ...opts, silent: false })
