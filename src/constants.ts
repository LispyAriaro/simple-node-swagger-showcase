export const HTTP_STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  EXTERNAL_SERVER_ERROR: 520,
}

export const HTTP_STATUS_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
}

export const STANDARDIZED_ERROR_CODE = {
  generic: 'generic',
  serialization: 'serialization',
  unhandledModuleException: 'unhandled_module_exception',
  validation: 'validation',
  externalBadRequest: 'external_bad_request',
  externalUnauthorized: 'external_unauthorized',
  externalUnprocessableEntity: 'external_unprocessable_entity',
  externalTooManyRequests: 'external_too_many_requests',
  externalServerError: 'external_server_error',
  externalNotImplemented: 'external_not_implemented',
  externalBadGateway: 'external_bad_gateway',
  externalServiceUnavailable: 'external_service_unavailable',
  externalGatewayTimeout: 'external_gateway_timeout',
}
