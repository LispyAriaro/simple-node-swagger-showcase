import Joi from 'joi'


export const locationSchema = Joi.object({
  name: Joi.string().allow(null),
  address: Joi.string(),
})


export interface ILocationRequest {
  name: string,
  address: string,

  currentUser?: any,
}

export interface ILocationResponse {
  uuid?: string,
  name: string,
  address: string,
}
