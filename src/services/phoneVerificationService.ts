import { generateOtp, utcNow } from '../utils/core'
import { EntityManager, getConnection, getRepository } from 'typeorm'
import { PhoneVerification } from '../entity/PhoneVerification'
import { User } from '../entity/User'
import { getAccessToken } from './tokenService'
import { UserAccessToken } from '../entity/UserAccessToken'
import { BadRequestError } from '../utils/error-response-types'



export const sendPhoneVerificationOtp = async (userId: number, phoneNumber: string, msisdn: string, 
    otp: string, smsMessage: string, transactionalEntityManager?: EntityManager): Promise<boolean> => {

  const phoneVerificationRepoT = transactionalEntityManager ? 
    transactionalEntityManager.getRepository(PhoneVerification) :
    getRepository(PhoneVerification)

  let phoneVerify = await phoneVerificationRepoT.findOne({
    userId,
    isVerified: false
  })

  if(phoneVerify) {
    await phoneVerificationRepoT.createQueryBuilder()
      .update(PhoneVerification)
      .set({ otp })
      .where({
        id: phoneVerify.id
      })
      .execute()
  } else {
    phoneVerify = new PhoneVerification().initialize(userId, phoneNumber, msisdn, otp)
    phoneVerify = await phoneVerificationRepoT.save(phoneVerify)  
  }

  const smsSentSuccessfully = true

  await phoneVerificationRepoT.createQueryBuilder()
    .update(PhoneVerification)
    .set({
      smsSentSuccessfully
    })
    .where({
      id: phoneVerify.id
    })
    .execute()
  
  return smsSentSuccessfully
}

export const processPhoneVerification = async (existingUser: User, phoneNumber: string, otp: string): Promise<UserAccessToken> => {
  const phoneVerificationRepo = getRepository(PhoneVerification)

  const phoneVerify = await phoneVerificationRepo.findOne({
    userId: existingUser.id,
    isVerified: false
  })

  if(!phoneVerify) {
    throw new BadRequestError('Invalid phone verification information')
  }

  if(phoneVerify.phoneNumber !== phoneNumber || phoneVerify.otp !== otp) {
    throw new BadRequestError('Invalid phone verification information')
  }

  const now = utcNow()

  const phoneVerified: boolean = await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
    const phoneVerificationRepoT = transactionalEntityManager.getRepository(PhoneVerification)
    const userRepoT = transactionalEntityManager.getRepository(User)

    await phoneVerificationRepoT.createQueryBuilder()
      .update(PhoneVerification)
      .set({ isVerified: true, verifiedAt: now })
      .where({
        id: phoneVerify.id
      })
      .execute()

    if(existingUser.isPhoneVerified) {
      return true
    } else {
      await userRepoT.createQueryBuilder()
        .update(User)
        .set({
          phoneNumber: phoneVerify.phoneNumber,
          msisdn: phoneVerify.msisdn,
          isEnabled: true,
          isHidden: false,
          isPhoneVerified: true,
          phoneVerifiedAt: now,
        })
        .where({
          id: existingUser.id
        })
        .execute()
    }
    return true
  })

  const accessToken = await getAccessToken(existingUser)
  return accessToken
}
