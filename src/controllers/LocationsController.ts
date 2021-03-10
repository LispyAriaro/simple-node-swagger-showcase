import IServerResponse from "../interfaces/IServerResponse";
import { Get, Header, Request, Route, Tags, Security, Post, Body } from "tsoa";
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
    const locationRepo = getRepository(Location)

    const locations = await locationRepo.find({})

    const formattedLocations = locations.map(location => {
      return {
        uuid: location.uuid,
        name: location.name,
        address: location.address,
      }
    })

    let resData: IServerResponse<Array<ILocationResponse>> = {
      status: true,
      data: formattedLocations
    }

    return resData
  }

  @Post('')
  public async newLocation(@Body() req: ILocationRequest, @Header('x-access-token') accessToken?: string): Promise<IServerResponse<ILocationResponse>> {
    const {
      name, address, currentUser
    } = req

    const locationRepo = getRepository(Location)

    let location = new Location().initialize(name, address)
    location = await locationRepo.save(location)

    const formattedLocation: ILocationResponse = {
      uuid: location.uuid,
      name: location.name,
      address: location.address,
    }

    let resData: IServerResponse<ILocationResponse> = {
      status: true,
      message: 'All good',
      data: formattedLocation
    }
    return resData
  }
}
