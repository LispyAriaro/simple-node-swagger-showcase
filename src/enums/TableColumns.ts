
export enum UserColumns {
  UUID = 'user_uuid',

  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL_ADDRESS = 'email_address',
  PHONE_NUMBER = 'phone_number',
  MSISDN = 'msisdn',
  COUNTRY = 'country',
  ROLES = 'roles',

  IS_PHONE_VERIFIED = 'is_phone_verified',
  PHONE_VERIFIED_AT = 'phone_verified_at',

  IS_EMAIL_VERIFIED = 'is_email_verified',
  EMAIL_VERIFIED_AT = 'email_verified_at',
  
  IS_HIDDEN = 'is_hidden',
  IS_ONBOARDING_COMPLETE = 'is_onboarding_complete',
}

export enum UserAccessTokenColumns {
  USER_ID = 'user_id',
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
  IS_ACTIVE = 'is_active'
}
export enum PhoneVerificationColumns {
  USER_ID = 'user_id',
  PHONE_NUMBER = 'phone_number',
  MSISDN = 'MSISDN',
  OTP = 'otp',
  SMS_SENT_SUCCESSFULLY = 'sms_sent_successfully',
  IS_VERIFIED = 'is_verified',
  VERIFIED_AT = 'verified_at',
}

export enum LocationColumns {
  UUID = 'location_uuid',

  NAME = 'location_name',
  ADDRESS = 'location_address',

  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
}

export const TableColumns: any = {
  ID: 'id',
  IS_ENABLED: 'is_enabled',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  LOCATION_NAME: 'name',
  
  USERS: UserColumns,
  USER_ACCESS_TOKENS: UserAccessTokenColumns,
}

export default TableColumns
