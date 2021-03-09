import PhoneNumber from 'awesome-phonenumber'
import * as _ from 'underscore'
import { EntityManager, getConnection, getRepository } from 'typeorm'
import { User } from '../entity/User'
import { Roles } from '../enums/Roles'
import { sendPhoneVerificationOtp } from '../services/phoneVerificationService'
import { generateOtp } from '../utils/core'
import ISimpleUserInfo from '../interfaces/ISimpleUserInfo'


export const processNewUserInfo = async (phoneNumber: string, 
    countryLongName: string, countryCode: string, role: Roles): Promise<ISimpleUserInfo> => {    
  const userRepo = getRepository(User)

  const existingUserWithPhone = await userRepo.findOne({
    phoneNumber: phoneNumber,
    isPhoneVerified: true
  })

  const otp = generateOtp(6)

  if(existingUserWithPhone) {
    const msisdn = new PhoneNumber(phoneNumber, countryCode).getNumber()

    const smsMessage = `Your phone verification OTP: ${otp}`
    await sendPhoneVerificationOtp(existingUserWithPhone.id, phoneNumber, msisdn, otp, smsMessage)

    return {
      uuid: existingUserWithPhone.uuid,
      firstName: existingUserWithPhone.firstName,
      lastName: existingUserWithPhone.lastName,
      phoneVerificationOtp: process.env.NODE_ENV === 'development' ? otp : ''
    }
  }
  
  const msisdn = new PhoneNumber(phoneNumber, countryCode).getNumber()

  const user: User = new User().initialize('', '', countryLongName)
  user.roles = [role]

  const savedUser: User = await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
    const userRepoT = transactionalEntityManager.getRepository(User)
    
    let savedUser = await userRepoT.save(user)

    const smsMessage = (role === Roles.ADMIN || role === Roles.SUPERADMIN) ? 
      `You have been invited to be an Admin on TradeGrid. ` 
      + `Click the below link to proceed. https://admin.thetradegrid.com/phone/verify/${savedUser.uuid}`  
      +` Your phone verification OTP is: ${otp}`
      :
      `Your phone verification OTP: ${otp}`
    
    await sendPhoneVerificationOtp(savedUser.id, phoneNumber, msisdn, otp, smsMessage, transactionalEntityManager)

    return savedUser
  })

  const formattedNewUser: ISimpleUserInfo = {
    uuid: savedUser.uuid,
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    phoneVerificationOtp: process.env.NODE_ENV === 'development' ? otp : ''
  }

  return formattedNewUser
}
