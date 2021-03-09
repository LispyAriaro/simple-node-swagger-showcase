import 'reflect-metadata'
import app from './app'
import logger from './logger'
import runDatabaseMigrations from './migrations'


(async () => {
  await runDatabaseMigrations();
})();

// - Start Http Server
const portAsString: string = (process.env.PORT as string);
let port: number | undefined = parseInt(portAsString) || 3000
let server = app.listen(port)

logger.info(`Environment: `, process.env.NODE_ENV)
