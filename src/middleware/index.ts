import express from 'express'
import helmet from 'helmet'

import runBodyParseMiddleware from './bodyParser'
import devEnvironmentVars from './devEnvConfig'
import setupSwagger from './swagger';


const iniitializeMiddlewares = (app: express.Application) => {
  app.use(helmet())

  devEnvironmentVars()
  
  runBodyParseMiddleware(app)

  // This is key to make swagger work
  app.use(express.static("public"))  
  setupSwagger(app)
}

export default iniitializeMiddlewares
