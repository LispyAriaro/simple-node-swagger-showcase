import Joi from 'joi'

const schema = Joi.object({
  refreshToken: Joi.string().required(),
}).options({ allowUnknown: true })

export interface IRefreshToken {
  refreshToken: string,
}

export default schema;
