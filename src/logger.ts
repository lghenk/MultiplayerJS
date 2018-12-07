const pino = require('pino')
const fs = require('fs')
const childProcess = require('child_process')
const stream = require('stream')

// Environment variables
const cwd = process.cwd()
const { env } = process
const logPath = `${__dirname}/../logs`

// Create a stream where the logs will be written
const logThrough = new stream.PassThrough()
export const logger = pino({ name: 'Multiplayer Service' }, logThrough)

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

// Log to multiple files using a separate process
const child = childProcess.spawn(process.execPath, [
  require.resolve('pino-tee'),
  'warn', `${logPath}/warn.log`,
  'error', `${logPath}/error.log`,
  'fatal', `${logPath}/fatal.log`,
  'info', `${logPath}/info.log`,
  'debug', `${logPath}/debug.log`
], { cwd, env })

logThrough.pipe(child.stdin)
logThrough.on('data', (data: any) => {
  console.log(data.toString().trim())
})

logger.level = process.env.LOG_LEVEL || 'fatal'