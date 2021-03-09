import Joi from 'joi'

export const userSignupPhoneSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  countryLongName: Joi.string().required(),
})

export interface IUserSignupPhoneDetails {
  phoneNumber: string,
  countryLongName: string,
}


export const userSignupPersonalDetailsSchema = Joi.object({
  firstName: Joi.string().min(3).max(255).required(),
  lastName: Joi.string().min(3).max(255).required(),
})

export interface IUserSignupPersonalDetails {
  firstName: string,
  lastName: string,

  currentUser: any
}


export default userSignupPhoneSchema
