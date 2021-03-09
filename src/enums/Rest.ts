const Rest = {
  STATUS: 'status',
  MESSAGE : 'message',
  ERRORS : 'errors',
  DATA : 'data',

  TOKEN : 'token',
  JWT_TIMEOUT : 259200,            // 3 days
  JWT_REFRESH_TIMEOUT : 604800,    // 7 days
}

export const Paths = {
  SIGNUP: 'signup',
  ACCESS: 'access',
  ADMINS: 'admins',
  BANK: 'bank',
  MISCELLANEOUS: 'miscellaneous',
  PROFILE: 'profile',
  LOCATIONS: 'locations',
  QUOTE_REQUEST: 'quoterequest',
  SETTINGS: 'settings'
}

export default Rest
