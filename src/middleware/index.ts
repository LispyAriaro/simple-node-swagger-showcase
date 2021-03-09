import express from 'express'
import helmet from 'helmet'

import runBodyParseMiddleware from './bodyParser'
import httpLogger from './http-logger'
import setUncaughtExceptionHandler from './globalExceptionHandler'
import devEnvironmentVars from './devEnvConfig'
import setupSwagger from './swagger';


const iniitializeMiddlewares = (app: express.Application) => {
  app.use(helmet())

  devEnvironmentVars()
  
  runBodyParseMiddleware(app)

  if(process.env.NODE_ENV === 'production') {
    app.use(httpLogger)
  }

  // This is key to make swagger work
  app.use(express.static("public"))
  
  setupSwagger(app)

  setUncaughtExceptionHandler(app)
}

export default iniitializeMiddlewares
