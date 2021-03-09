import express from 'express'
import bodyParser from 'body-parser'


const runBodyParseMiddleware = (app: express.Application) => {
  app.use(bodyParser.json({
    limit: '5mb',
    type: 'application/json'
  }))

  // app.use(express.json());
}

export default runBodyParseMiddleware
