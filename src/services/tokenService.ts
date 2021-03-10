import { getRepository, getConnection } from 'typeorm'
import jwt from 'jsonwebtoken'

import { User } from '../entity/User'

import { utcNow } from '../utils/core'
import { UserAccessToken } from '../entity/UserAccessToken'

import { ServerError } from '../utils/error-response-types'
import Rest from '../enums/Rest'


export const getAccessToken = async (existingUser: User, newTokens?: boolean) : Promise<UserAccessToken> => {
  let signableUser = {
    uuid: existingUser.uuid,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName
  }

  const generatedToken = jwt.sign(signableUser, process.env.JWT_SECRET, {
    expiresIn: Rest.JWT_TIMEOUT
  })
  const generatedRefreshToken = jwt.sign(signableUser, process.env.JWT_SECRET, {
    expiresIn: Rest.JWT_REFRESH_TIMEOUT
  })

  const now = utcNow()

  const userId = existingUser.id
  const userAccessTokenRepo = getRepository(UserAccessToken)
  let accessToken = await userAccessTokenRepo.findOne({userId})

  if(accessToken && !newTokens) {// Use existing access token if still active 
    if(accessToken.isActive) {
      try {
        const decoded = jwt.verify(accessToken.token, process.env.JWT_SECRET)
      } catch(e) {
        accessToken.token = generatedToken
        accessToken.refreshToken = generatedRefreshToken
        accessToken.updatedAt = now
      }
    } else {
      accessToken.token = generatedToken
      accessToken.refreshToken = generatedRefreshToken
      accessToken.updatedAt = now
    }
  } else {
    accessToken = new UserAccessToken()
    accessToken.user = existingUser
    accessToken.token = generatedToken
    accessToken.refreshToken = generatedRefreshToken
    accessToken.createdAt = now
  }
  
  accessToken.isActive = true

  const savedAccessToken: boolean = await getConnection().transaction(async transactionalEntityManager => {
    const userAccessTokenRepoT = transactionalEntityManager.getRepository(UserAccessToken)

    await userAccessTokenRepoT.delete({userId})
    await userAccessTokenRepoT.save(accessToken)

    return true
  })

  if(savedAccessToken) {
    return accessToken
  } else {
    throw new ServerError('Login failed! Server error. Please try again.')
  }
}

export const getNewAccessTokens = async (existingUser: User) : Promise<UserAccessToken> => {
  return getAccessToken(existingUser, true)
}
