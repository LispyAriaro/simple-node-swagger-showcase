import { DetailedError } from "../utils/error-response-types";

export default interface IServerResponse<T> {
  status: boolean
  message?: string
  data?: T

  error?: string
  errors?: Array<DetailedError>
}
