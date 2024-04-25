import inquirer from 'inquirer'
import chalk from 'chalk'
import runner from '../utils/runner.js'
import { Spinner } from '@topcli/spinner'
import { formatElapsedTime } from '../utils/helpers.js'

const node = {
  selected_version: '8.3',

  async prepare() {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'node_version',
        message: 'Select Node.js version (LTS Only)',
        choices: [
          '20.12.2',
          '18.20.2',
          '16.20.2',
          '14.21.3',
          '12.22.12',
          '10.24.1',
          '8.17.0',
          '6.17.1'
        ],
        filter(val) {
          return val.toLowerCase()
        },
        loop: false
      }
    ])
    this.selected_version = answer.node_version
    return this
  },

  async handle() {
    const spinner = new Spinner().start('Installing Node.js & npm')

    try {
      process.setgid(parseInt(process.env.SUDO_UID || process.getuid(), 10))
      process.setuid(parseInt(process.env.SUDO_UID || process.getuid(), 10))
      process.env.HOME = `/home/${process.env.SUDO_USER}`

      await runner.run(
        `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && source $HOME/.nvm/nvm.sh && nvm install ${this.selected_version} && nvm use ${this.selected_version}`
      )

      spinner.succeed(`Node.js & npm installed ${formatElapsedTime(spinner)}`)
      return Promise.resolve()
    } catch (error) {
      spinner.failed('Failed to install Node.js')
      return Promise.reject(error)
    }
  },

  async afterInstall() {
    console.log(
      chalk.dim('Node Version: ') + chalk.green(this.selected_version)
    )
  }
}

export { node }
