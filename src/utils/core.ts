import moment from 'moment'

import { DetailedError, BadRequestError } from './error-response-types'
import { STANDARDIZED_ERROR_CODE } from '../constants'


export const validateAJoi = (joiSchema, object) => {
  const validationResults = joiSchema.validate(object, {
    abortEarly: false, 
    allowUnknown: true
  })
  if (!validationResults.error) {
    return null
  }

  const validationResult = validationResults.error.details.map(errorDetails => {
    return {
      field: errorDetails.context.key,
      message: errorDetails.message,
    }
  })

  if (validationResult) {
    const detailedErrors = validationResult.map(validation => {
      return new DetailedError(validation.message, STANDARDIZED_ERROR_CODE.validation)
    })
    throw new BadRequestError(validationResult[0].message, detailedErrors)
  }
}

export const utcNow = () => {
  return moment.utc().toDate()
}

export const standardizeDateTime = (dateTime: string) => {
  return moment.utc(dateTime).toDate()
}


function rand (min, max) {
  const random = Math.random()
  return Math.floor(random * (max - min) + min)
}

export const generateOtp = (length: number) => {
  let otp = ''
  const digits = '0123456789'

  while (otp.length < length) {
    const charIndex = rand(0, digits.length - 1)
    otp += digits[charIndex]
  }
  return otp
}

export const handleAxiosRequestError = (error) => {
  if (error.response) {
    /*
    * The request was made and the server responded with a
    * status code that falls out of the range of 2xx
    */
    return error.response.data.error
  } else if (error.request) {
    /*
    * The request was made but no response was received, `error.request`
    * is an instance of XMLHttpRequest in the browser and an instance
    * of http.ClientRequest in Node.js
    */
    const errorMessage = 'The server seems down at the moment. Please try again later.'
    return errorMessage
  } else {
    // Something happened in setting up the request and triggered an Error
    return error.message
  }
}
