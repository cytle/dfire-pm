var path = require('path')
var projects = path.resolve(__dirname, '../')
var npmRunScript = path.resolve(__dirname, './scripts/npm-run.sh')

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'proxy',
      cwd: path.resolve(__dirname, './proxy'),
      script: 'index.js',
      watch: true
    },
    {
      name: 'new-meal',
      cwd: path.resolve(projects, 'new-meal'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      },
    },
    {
      name: 'meal',
      cwd: path.resolve(projects, 'static-meal'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      }
    },
    {
      name: 'om',
      cwd: path.resolve(projects, 'static-om'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      }
    },
    {
      name: 'bill',
      cwd: path.resolve(projects, 'static-bill'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      }
    },
    {
      name: 'shop',
      cwd: path.resolve(projects, 'static-shop'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      }
    },
    {
      name: 'marketing',
      cwd: path.resolve(projects, 'static-marketing'),
      script: npmRunScript,
      env: {
        NODE_ENV: 'dev'
      }
    }  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  // deploy: {
  //   production: {
  //     user: 'node',
  //     host: '212.83.163.1',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/production',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
  //   },
  //   dev: {
  //     user: 'node',
  //     host: '212.83.163.1',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/development',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
  //     env: {
  //       NODE_ENV: 'dev'
  //     }
  //   }
  // }
}
