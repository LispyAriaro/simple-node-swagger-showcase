import { Entity, Column, Index, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { v4 as uuidv4 } from 'uuid'

import { utcNow } from '../utils/core'
import TableColumns, { UserColumns } from '../enums/TableColumns'
import Tables from "../enums/Tables";
import BaseEntity from "./BaseEntity";
import { UserAccessToken } from "./UserAccessToken";
import { PhoneVerification } from "./PhoneVerification";
import { Roles } from "../enums/Roles";


@Entity({ name: Tables.USERS })
@Index(['uuid'], { unique: true })
@Index(['emailAddress'])
export class User extends BaseEntity {
  @Column({name: UserColumns.UUID, unique: true })
  uuid: string;

  @Column({length: 255, name: UserColumns.FIRST_NAME, nullable: true })
  firstName: string;

  @Column({length: 255, name: UserColumns.LAST_NAME, nullable: true })
  lastName: string;

  @Column({name: UserColumns.PHONE_NUMBER, nullable: true })
  phoneNumber: string;

  @Column({name: UserColumns.MSISDN, nullable: true })
  msisdn: string;

  @Column({name: UserColumns.COUNTRY, nullable: false })
  country: string;

  @Column({name: UserColumns.EMAIL_ADDRESS, nullable: true })
  emailAddress: string;

  @Column({type: 'text', name: UserColumns.ROLES, array: true, nullable: false})
  roles: Array<Roles>
  
  @Column({type: 'boolean', name: UserColumns.IS_PHONE_VERIFIED, default: false })
  isPhoneVerified: boolean

  @Column({name: UserColumns.PHONE_VERIFIED_AT, nullable: true })
  phoneVerifiedAt: Date
  //--
  @Column({type: 'boolean', name: UserColumns.IS_EMAIL_VERIFIED, default: false })
  isEmailVerified: boolean

  @Column({name: UserColumns.EMAIL_VERIFIED_AT, nullable: true })
  emailVerifiedAt: Date


  @Column({type: 'boolean', name: TableColumns.IS_ENABLED, nullable: false, default: false })
  isEnabled: boolean

  @Column({type: 'boolean', name: UserColumns.IS_HIDDEN, nullable: true })
  isHidden: boolean


  @OneToMany(type => PhoneVerification, phoneVerification => phoneVerification.user, {
    eager: false
  })
  phoneVerifications: Promise<PhoneVerification[]>

  @OneToMany(type => UserAccessToken, accessToken => accessToken.user, {
    eager: false,
    onDelete: 'CASCADE'
  })
  accessTokens: Promise<UserAccessToken[]>


  initialize(firstName: string, lastName: string, country: string) {
    this.uuid = uuidv4()

    this.firstName = firstName
    this.lastName = lastName
    this.country = country

    this.isEnabled = false
    this.isHidden = null

    this.createdAt = utcNow()

    return this
  }
}
