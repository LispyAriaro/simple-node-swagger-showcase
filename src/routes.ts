import express, { Router, Request, Response } from 'express'
import HttpStatus from 'http-status-codes'

import { verifyToken } from './auth/TokenVerifier'
import { grantAccess } from './auth/roles'
import { Paths } from './enums/Rest'
import { respondWithError } from './utils/express'
import { validateAJoi } from './utils/core'

import { userSignupPhoneSchema, userSignupPersonalDetailsSchema } from './dto/userSignupSchema'
import phoneNumberVerifySchema from './dto/phoneNumberVerifySchema'
import loginWithPhoneSchema, { phoneLoginOtpVerifySchema } from './dto/loginWithPhoneSchema'
import refreshTokenSchema from './dto/refreshTokenSchema'
import { locationSchema } from './dto/setLocationSchema'

import { MiscController } from './controllers/MiscController'
import { SignupController } from './controllers/SignupController'
import { LocationsController } from './controllers/LocationsController'


const setupRouter = () => {
  const router: Router = express.Router()


  //--Signup
  router.post('/' + Paths.SIGNUP + '/phonenumber', async (req: Request, res: Response) => {
    try {
      validateAJoi(userSignupPhoneSchema, req.body)
      const controller = new SignupController()
      const responseData = await controller.processNewPhoneNumber(req.body)

      res.status(HttpStatus.CREATED).send(responseData)
    } catch (e) {
      return respondWithError(res, e)
    }
  })

  router.post('/' + Paths.SIGNUP + '/phonenumber/verify', async (req: Request, res: Response) => {
    try {
      validateAJoi(phoneNumberVerifySchema, req.body)

      const controller = new SignupController()
      const responseData = await controller.phoneNumberVerify(req.body)

      res.status(HttpStatus.OK).send(responseData)
    } catch (e) {
      return respondWithError(res, e)
    }
  })
  
  router.put('/' + Paths.SIGNUP + '/userPersonalInfo', verifyToken, async (req: Request, res: Response) => {
    try {
      validateAJoi(userSignupPersonalDetailsSchema, req.body)
      const controller = new SignupController()
      const responseData = await controller.processUserSignupInfo(req.body)

      res.status(HttpStatus.OK).send(responseData)
    } catch (e) {
      return respondWithError(res, e)
    }
  })
  //--End of Signup

  //--Miscellaneous
  router.get('/' + Paths.MISCELLANEOUS + '/countries', async (req: Request, res: Response) => {
    const controller = new MiscController()
    const responseData = await controller.getCountriesList()

    res.status(HttpStatus.OK).send(responseData)
  })
  //--

  //--Locations
  router.get('/' + Paths.LOCATIONS, verifyToken, async (req: Request, res: Response) => {
    const controller = new LocationsController()
    const responseData = await controller.getLocations(req.body)

    res.status(HttpStatus.OK).send(responseData)
  })

  router.post('/' + Paths.LOCATIONS, verifyToken, async (req: Request, res: Response) => {
    try {
      validateAJoi(locationSchema, req.body)
      const controller = new LocationsController()
      const responseData = await controller.newLocation(req.body)

      res.status(HttpStatus.CREATED).send(responseData)
    } catch (e) {
      return respondWithError(res, e)
    }
  })
  //--

  return router
}

export default setupRouter
