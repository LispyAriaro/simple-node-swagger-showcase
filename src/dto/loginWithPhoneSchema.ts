import Joi from 'joi'

const schema = Joi.object({
  phoneNumber: Joi.string().required(),
  countryCode: Joi.string().required()
})

export interface ILoginWithPhone {
  phoneNumber: string,
  countryCode: string,
}

export const phoneLoginOtpVerifySchema = Joi.object({
  phoneNumber: Joi.string().required(),
  otp: Joi.string().required()
})

export interface ILoginWithPhoneOtpVerify {
  phoneNumber: string,
  otp: string
}


export default schema
