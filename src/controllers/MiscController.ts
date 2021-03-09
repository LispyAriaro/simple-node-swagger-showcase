import { Body, Get, Post, Route, Tags } from "tsoa";
import ICountry from "../interfaces/ICountry";
import IServerResponse from "../interfaces/IServerResponse";
import countries from "../utils/countries";

// DO NOT EXPORT DEFAULT

@Route("api/miscellaneous")
@Tags('Miscellaneous')
export class MiscController {

  @Get('/countries')
  public async getCountriesList(): Promise<IServerResponse<Array<ICountry>>> {
    let resData: IServerResponse<Array<ICountry>> = {
      status: true,
      data: countries
    }

    return resData
  }
}
