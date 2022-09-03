export interface LogOptions {
	silent?: boolean
	bold?: boolean
	noColors?: boolean
}

export type LogFn = (msg: string, opts?: LogOptions) => void
