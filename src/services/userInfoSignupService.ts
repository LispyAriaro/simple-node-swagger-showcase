import PhoneNumber from 'awesome-phonenumber'
import * as _ from 'underscore'
import { EntityManager, getConnection } from 'typeorm'
import { User } from '../entity/User'
import { Roles } from '../enums/Roles'
import { sendPhoneVerificationOtp } from '../services/phoneVerificationService'
import { generateOtp } from '../utils/core'
import Countries from '../utils/countries'
import ICountry from '../interfaces/ICountry'


export const processNewUserInfo = async (phoneNumber: string, 
    countryLongName: string, role: Roles): Promise<User> => {

  const foundCountry: ICountry = _.find(Countries, countryItem => countryItem.name === countryLongName)
  const countryCode = foundCountry.code
  
  const msisdn = new PhoneNumber(phoneNumber, countryCode).getNumber()

  const user: User = new User().initialize('', '', countryLongName)
  user.roles = [role]

  const savedUser: User = await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
    const userRepoT = transactionalEntityManager.getRepository(User)
    
    let savedUser = await userRepoT.save(user)

    const otp = generateOtp(6)
    const smsMessage = (role === Roles.ADMIN || role === Roles.SUPERADMIN) ? 
      `You have been invited to be an Admin on TradeGrid. ` 
      + `Click the below link to proceed. https://admin.thetradegrid.com/phone/verify/${savedUser.uuid}`  
      +` Your phone verification OTP is: ${otp}`
      :
      `Your phone verification OTP: ${otp}`
    
    await sendPhoneVerificationOtp(savedUser.id, phoneNumber, msisdn, otp, smsMessage, transactionalEntityManager)

    return savedUser
  })

  return savedUser
}
