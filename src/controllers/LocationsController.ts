import IServerResponse from "../interfaces/IServerResponse";
import { Get, Header, Request, Route, Tags, Security, Post, Body } from "tsoa";
import * as _ from 'underscore'
import { Roles } from "../enums/Roles";
import { getRepository } from "typeorm";
import { ILocationRequest, ILocationResponse } from "../dto/setLocationSchema";
import { Location } from "../entity/Location";

// DO NOT EXPORT DEFAULT

@Route("api/locations")
@Tags('Locations')
@Security("jwt")
export class LocationsController {

  @Get('')
  public async getLocations(@Request() req: any, @Header('x-access-token') accessToken?: string): Promise<IServerResponse<Array<ILocationResponse>>> {
    const { currentUser } = req

    const hasCommercialRole = _.find(currentUser.roles, role => role === Roles.COMMERCIAL)

    const locationRepo = getRepository(Location)

    const locations = await locationRepo.find({})

    const formattedLocations = _.map(locations, loc => _.omit(loc, 'id', 'businessId', 'latLngGeog', 'createdAt', 'updatedAt'))

    let resData: IServerResponse<Array<ILocationResponse>> = {
      status: true,
      data: formattedLocations
    }

    return resData
  }

  @Post('')
  public async newLocation(@Body() req: ILocationRequest, @Header('x-access-token') accessToken?: string): Promise<IServerResponse<ILocationResponse>> {
    const {
      name, address, latitude, longitude, city, state, country, currentUser
    } = req

    const hasCommercialRole = _.find(currentUser.roles, role => role === Roles.COMMERCIAL)

    const locationRepo = getRepository(Location)

    let location = new Location().initialize(name, address, latitude, longitude, city, state, country)
    location = await locationRepo.save(location)

    const formattedLocation: ILocationResponse = _.omit(location, [
      'id', 'createdAt', 'updatedAt'
    ])

    let resData: IServerResponse<ILocationResponse> = {
      status: true,
      message: 'All good',
      data: formattedLocation
    }
    return resData
  }
}
