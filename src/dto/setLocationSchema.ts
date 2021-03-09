import Joi from 'joi'

const baseGeoLocationSchema = Joi.object({
  name: Joi.string().allow(null),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),

  country: Joi.string(),
  state: Joi.string(),
  city: Joi.string(),
})

export const locationSchema = baseGeoLocationSchema.keys({
  address: Joi.string(),
  visibilityRadiusInMiles: Joi.number().allow(null).required()
})


interface IBaseGeoLocation {
  name?: string,
  latitude: number, 
  longitude: number,

  country: string, 
  state: string,
  city: string,
}

export interface ILocationRequest extends IBaseGeoLocation {
  address: string,

  currentUser?: any,
}

export interface ILocationResponse extends ILocationRequest {
  uuid?: string,
}
