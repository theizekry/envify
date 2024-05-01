import chalk from 'chalk'
import { exec } from 'child_process'
import { Spinner } from '@topcli/spinner'

const username = process.env.SUDO_USER || process.env.USER

const spinner = async (startMsg, successMsg, failMsg, callback, onFail) => {
  const spinner = new Spinner().start(startMsg)

  try {
    await callback()
    spinner.succeed(`${successMsg} ${formatElapsedTime(spinner)}`)
    return Promise.resolve()
  } catch (error) {
    await onFail(error)
    spinner.failed(failMsg)
    return Promise.reject(error)
  }
}

const formatElapsedTime = spinner => {
  return `(` + chalk.yellow(`${spinner.elapsedTime.toFixed(2)}ms`) + `)`
}

const isPackageInstalled = async packageName => {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(`dpkg-query -l ${packageName}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve({ stdout, stderr })
      })
    })

    return stdout.includes(packageName)
  } catch (error) {
    console.error(
      'An error occurred while checking package installation:',
      error
    )
    return false
  }
}

export { formatElapsedTime, isPackageInstalled, username, spinner }
