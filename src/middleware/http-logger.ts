import express, {Request, Response, NextFunction} from 'express'
import logger from '../logger'


function tryToParseJSON(item: any) {
  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
}

const middlewareHandler = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const requestBody = tryToParseJSON(req.body)

    logger.info({
      endPoint: req.originalUrl,
      request: {
        // headers: req.headers,
        body: requestBody,
      },
      response: {
        statusCode: res.statusCode,
      },
    })
  })

  next()
}

export default middlewareHandler
