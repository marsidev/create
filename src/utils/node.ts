export const currentVersion = process.versions.node

export const requiredVersion = 14

export const validNodeVersion = () => {
	const semver = currentVersion.split('.')
	const major = semver[0]
	return Number(major) >= requiredVersion
}
