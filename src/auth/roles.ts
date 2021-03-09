import { AccessControl } from 'accesscontrol'
import { Roles } from "../enums/Roles"
import { User } from '../entity/User'
import { respondWithUnauthorized } from '../utils/express'
import { ErrorMessages } from '../enums/ErrorMessages'


export const accessControl = (function () {
  const ac:AccessControl = new AccessControl()

  ac.grant(Roles.NORMAL_USER)
    .createOwn("business")

  ac.grant(Roles.COMMERCIAL)
    .readOwn("business")
    .createOwn("business")

  ac.grant(Roles.ADMIN)
    .readOwn("signup-assignments")
    .updateOwn("signup-assignments")
    .updateAny("businessprofile")

  ac.grant(Roles.SUPERADMIN)
    .extend(Roles.ADMIN)
    .createAny("admin")
    .readAny("admin")
  
  return ac
})()


export const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const currentUser: User = req.body.currentUser
      const userRoleNames = currentUser.roles || []

      let grantedPermission = null

      for (let i = 0; i < userRoleNames.length; ++i) {
        const permission = accessControl.can(userRoleNames[i])[action](resource)

        if (permission.granted) {
          grantedPermission = true
          break;
        }
      }

      if(!grantedPermission) {
        return respondWithUnauthorized(res, ErrorMessages.ACCESS_DENIED_UNAUTHORIZED)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
