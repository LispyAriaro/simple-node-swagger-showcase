import express from 'express'
import iniitializeMiddlewares from './middleware'

import setupRouter from './routes'

process.env.TZ = "UTC"

let app: express.Application = express()

iniitializeMiddlewares(app)

app.use('/api', setupRouter())

export default app
