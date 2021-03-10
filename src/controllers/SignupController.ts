import { Body, Header, Post, Put, Route, Security, Tags } from "tsoa";
import IServerResponse from "../interfaces/IServerResponse";
import { IUserSignupPhoneDetails, IUserSignupPersonalDetails } from "../dto/userSignupSchema";
import Countries from "../utils/countries";
import { BadRequestError, ConflictError } from '../utils/error-response-types'
import { User } from "../entity/User";
import { processNewUserInfo } from "../services/userInfoSignupService";
import ICountry from "../interfaces/ICountry";
import ISimpleUserInfo from "../interfaces/ISimpleUserInfo";
import { getRepository } from "typeorm";
import { Roles } from "../enums/Roles";

import { validate as uuidValidate } from 'uuid'
import IAccessTokenData from '../interfaces/IAccessTokenData'
import { IPhoneNumberVerify } from '../dto/phoneNumberVerifySchema'
import { processPhoneVerification } from '../services/phoneVerificationService'

// DO NOT EXPORT DEFAULT

@Route("/api/signup")
@Tags('Signup')
export class SignupController {

  @Post('/phonenumber')
  public async processNewPhoneNumber(@Body() req: IUserSignupPhoneDetails): Promise<IServerResponse<ISimpleUserInfo>> {
    const { phoneNumber, countryLongName } = req

    const foundCountry: ICountry = Countries.find(countryItem => countryItem.name === countryLongName)
    if(!foundCountry) {
      throw new BadRequestError('Selected country is invalid')
    }

    const dataInResponse: ISimpleUserInfo = await processNewUserInfo(phoneNumber, countryLongName, foundCountry.code, Roles.NORMAL_USER)

    let resData: IServerResponse<ISimpleUserInfo> = {
      status: true,
      data: dataInResponse
    }
    return resData
  }


  @Post('/phonenumber/verify')
  public async phoneNumberVerify(@Body() req: IPhoneNumberVerify): Promise<IServerResponse<IAccessTokenData>> {
    const { userUuid, phoneNumber, otp } = req

    if(!uuidValidate(userUuid)) {
      throw new BadRequestError('Invalid phone verification information')
    }

    const userRepo = getRepository(User)
    const existingUser = await userRepo.findOne({
      uuid: userUuid
    })

    if(!existingUser) {
      throw new BadRequestError('Invalid phone verification information')
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


  @Put('/userPersonalInfo')
  @Security("jwt")
  public async processUserSignupInfo(
      @Body() req: IUserSignupPersonalDetails, 
      @Header('x-access-token') accessToken?: string): Promise<IServerResponse<void>> {
    const { firstName, lastName, currentUser } = req

    if(currentUser.firstName || currentUser.lastName) {
      throw new ConflictError('User already has first name and last name')
    }

    const userRepo = getRepository(User)
    await userRepo.createQueryBuilder()
      .update(User)
      .set({
        firstName: firstName,
        lastName: lastName,
      })
      .where({
        id: currentUser.id
      })
      .execute()

    let resData: IServerResponse<void> = {
      status: true,
    }

    return resData
  }
}
