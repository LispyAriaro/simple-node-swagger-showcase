import express, {Request, Response} from 'express'
import verify from '../utils/JWT'

import { respondWithUnauthorized, respondWithServerError } from '../utils/express'
import { ErrorMessages } from '../enums/ErrorMessages'
import { getRepository } from 'typeorm'
import { UserAccessToken } from '../entity/UserAccessToken'
import { User } from '../entity/User'


export const verifyToken = async function (req: Request, res: Response, next) {
  if(!process.env.JWT_SECRET) {
    return respondWithServerError(res, 'Sorry, there was a server mis-configuration.')
  }
  
  let token = req.headers['x-access-token'] as string
  if(!token) {
    return respondWithUnauthorized(res, 'No access token provided')
  }

  try {
    const decoded: any = await verify(token, process.env.JWT_SECRET)
    const { uuid } = decoded

    const userRepo = getRepository(User)
    const currentUser = await userRepo.findOne({uuid: uuid})

    if(!currentUser) {
      return respondWithUnauthorized(res, ErrorMessages.USER_NON_EXISTENCE)
    }
    if(!currentUser.isEnabled) {
      return respondWithUnauthorized(res, ErrorMessages.USER_DISABLED)
    }

    const userAccessTokenRepo = getRepository(UserAccessToken)
    const userAccessToken = await userAccessTokenRepo.findOne({userId: currentUser.id, isActive: true})
    if(!userAccessToken) {
      return respondWithUnauthorized(res, ErrorMessages.ACCESS_DENIED_TOKEN_NON_EXISTENCE)
    }
    if(token !== userAccessToken.token) {
      return respondWithUnauthorized(res, ErrorMessages.ACCESS_DENIED_WRONG_TOKEN_SOURCE)
    }

    req.body.currentUser = currentUser
    next()
  } catch(e) {
    return respondWithUnauthorized(res, e.message)
  }
}
