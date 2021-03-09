import * as _ from 'underscore'

import PhoneNumber from 'awesome-phonenumber'
import { BadRequestError, UnauthorizedRequestError } from '../utils/error-response-types'
import verify from '../utils/JWT'
import { ErrorMessages } from '../enums/ErrorMessages'
import { getRepository } from 'typeorm'
import { UserAccessToken } from '../entity/UserAccessToken'
import { getNewAccessTokens } from '../services/tokenService'
import { User } from '../entity/User'
import IServerResponse from '../interfaces/IServerResponse'
import { Body, Post, Route, Tags } from 'tsoa'
import { IRefreshToken } from '../dto/refreshTokenSchema'
import IAccessTokenData from '../interfaces/IAccessTokenData'
import { sendPhoneVerificationOtp, processPhoneVerification } from '../services/phoneVerificationService'
import ICountry from '../interfaces/ICountry';
import { ILoginWithPhone, ILoginWithPhoneOtpVerify } from '../dto/loginWithPhoneSchema';
import { generateOtp } from '../utils/core';

// DO NOT EXPORT DEFAULT

@Route("api/access")
@Tags('Access')
export class AccessController {

  @Post('/login/phonenumber')
  public async loginWithPhone(@Body() req: ILoginWithPhone): Promise<IServerResponse<string>> {
    const { phoneNumber, countryCode } = req

    const msisdn = new PhoneNumber(phoneNumber, countryCode).getNumber()

    const userRepo = getRepository(User)
    const existingUser = await userRepo.findOne({
      msisdn,
      isPhoneVerified: true
    })

    if(!existingUser) {
      throw new BadRequestError('The phone number does NOT belong to a VALID TradeGrid user.')
    }
    
    const otp = generateOtp(6)
    const smsMessage = `Your phone verification OTP: ${otp}`
    await sendPhoneVerificationOtp(existingUser.id, phoneNumber, msisdn, otp, smsMessage)

    let resData: IServerResponse<string> = {
      status: true,
      data: process.env.NODE_ENV === 'development' ? otp : ''
    }
    return resData
  }


  @Post('/login/phonenumber/verify/otp')
  public async verifyPhoneForLogin(@Body() req: ILoginWithPhoneOtpVerify): Promise<IServerResponse<IAccessTokenData>> {
    const { phoneNumber, otp } = req

    const userRepo = getRepository(User)

    const existingUser = await userRepo
      .createQueryBuilder()
      .where("phone_number = :phoneNumber OR msisdn = :phoneNumber", {
        phoneNumber
      })
      .andWhere("is_phone_verified = true")
      .getOne()

    if(!existingUser) {
      throw new BadRequestError('The phone number does NOT belong to a VALID TradeGrid user.')
    }

    const accessToken = await processPhoneVerification(existingUser, phoneNumber, otp)

    let resData: IServerResponse<IAccessTokenData> = {
      status: accessToken ? true : false,
      data: {
        token: accessToken.token,
        refreshToken: accessToken.refreshToken
      }
    }
    return resData
  }

  @Post('/refreshtoken')
  public async handleRefreshToken(@Body() req: IRefreshToken): Promise<IServerResponse<IAccessTokenData>>  {
    const { refreshToken } = req

    if(!refreshToken) {
      throw new BadRequestError(ErrorMessages.ACCESS_DENIED_INVALID_REFRESH_TOKEN)
    }

    const decoded: any = await verify(refreshToken, process.env.JWT_SECRET)
    const { uuid } = decoded
    
    const userAccessTokenRepo = getRepository(UserAccessToken)
    const userAccessToken = await userAccessTokenRepo.findOne({
      refreshToken, isActive: true
    })

    if(!userAccessToken) {
      throw new UnauthorizedRequestError(ErrorMessages.ACCESS_DENIED_INVALID_REFRESH_TOKEN)
    }

    const userRepo = getRepository(User)
    const user: User = await userRepo.findOne({
      where: {
        uuid
      },
      select: ['id', 'uuid', 'emailAddress']
    })

    const accessToken = await getNewAccessTokens(user)

    let resData: IServerResponse<IAccessTokenData> = {
      status: true,
      message: 'All good',
      data: {
        token: accessToken.token,
        refreshToken: accessToken.refreshToken
      }
    }
    return resData
  }
}
