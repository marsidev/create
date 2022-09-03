import { blue, bold, green, red, yellow } from 'picocolors'

export interface LogOptions {
	silent?: boolean
	bold?: boolean
	noColors?: boolean
}

const defaultOptions: LogOptions = {
	silent: false,
	bold: true,
	noColors: false
}

type LogFn = (msg: string, opts?: LogOptions) => void

export const log: LogFn = (msg, opts = defaultOptions) => {
	if (opts.silent) return

	if (opts.noColors) {
		// eslint-disable-next-line no-control-regex
		return console.log(msg.replace(/\u001b[^m]*?m/g, ''))
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
