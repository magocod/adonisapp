import 'reflect-metadata'
import execa from 'execa'

// Import helpers from path module
import { join, isAbsolute, sep } from 'path'

import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname, '..')
sourceMapSupport.install({ handleUncaughtExceptions: false })

/**
 * [runMigrations description]
 */
async function runMigrations () {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

/**
 * [rollbackMigrations description]
 */
async function rollbackMigrations () {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}

/**
 * [startHttpServer description]
 */
async function startHttpServer () {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * [getTestFiles description]
 */
function getTestFiles () {
  let userDefined = process.argv.slice(2)[0]
  if (!userDefined) {
    return 'build/test/**/*.spec.js'
  }

  if (isAbsolute(userDefined)) {
    userDefined = userDefined.endsWith('.ts')
      ? userDefined.replace(`${join(__dirname, '..')}${sep}`, '')
      : userDefined.replace(`${join(__dirname)}${sep}`, '')
  }

  return `build/${userDefined.replace(/\.ts$|\.js$/, '')}.js`
}

/**
 * Configure test runner
 */
configure({
  files: getTestFiles(),
  before: [
    runMigrations,
    startHttpServer,
  ],
  after: [
    rollbackMigrations,
  ]
})
