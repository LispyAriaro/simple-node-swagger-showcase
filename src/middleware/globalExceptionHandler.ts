import express, { Request, Response, NextFunction} from 'express'
import { BaseServiceException } from '../utils/error-response-types'
import { respondWithError } from '../utils/express'


const setUncaughtExceptionHandler = (app: express.Application) => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      console.log(`Got an error: `, err)

      return respondWithError(res, err as BaseServiceException)
      // res.status(500)
      // res.json({ error: err.message })
    }
    next(err)
  })
}

export default setUncaughtExceptionHandler
