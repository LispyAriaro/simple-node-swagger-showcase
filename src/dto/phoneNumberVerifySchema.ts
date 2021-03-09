import Joi from 'joi'

const schema = Joi.object({
  userUuid: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  otp: Joi.string().required(),
})

export interface IPhoneNumberVerify {
  userUuid: string,
  phoneNumber: string,
  otp: string,
}

export default schema
