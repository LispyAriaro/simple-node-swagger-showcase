import { Entity, Column, Index, BaseEntity as TypeOrmBaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn  } from "typeorm"

import { utcNow } from '../utils/core'
import TableColumns, { PhoneVerificationColumns } from '../enums/TableColumns'
import Tables from "../enums/Tables";
import { User } from "./User";


@Entity({ name: Tables.PHONE_VERIFICATIONS })
@Index(['phoneNumber'])
@Index(['phoneNumber', 'isVerified'])
export class PhoneVerification extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'bigint', name: PhoneVerificationColumns.USER_ID })
  userId: number;

  @ManyToOne(type => User, user => user.phoneVerifications)
  @JoinColumn({name: PhoneVerificationColumns.USER_ID, referencedColumnName: TableColumns.ID})
  user: User
  
  @Column({name: PhoneVerificationColumns.PHONE_NUMBER, nullable: false })
  phoneNumber: string;

  @Column({name: PhoneVerificationColumns.MSISDN, nullable: false })
  msisdn: string;

  @Column({name: PhoneVerificationColumns.OTP, nullable: false })
  otp: string;

  @Column({type: 'boolean', name: PhoneVerificationColumns.SMS_SENT_SUCCESSFULLY, nullable: true })
  smsSentSuccessfully?: boolean

  @Column({type: 'boolean', name: PhoneVerificationColumns.IS_VERIFIED, default: false })
  isVerified: boolean

  @Column({name: PhoneVerificationColumns.VERIFIED_AT, nullable: true })
  verifiedAt: Date

  @CreateDateColumn({type: 'timestamptz', name: TableColumns.CREATED_AT, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  initialize(userId: number, phoneNumber: string, msisdn: string, otp: string) {
    this.userId = userId
    this.phoneNumber = phoneNumber
    this.msisdn = msisdn
    this.otp = otp
    this.smsSentSuccessfully = null

    this.isVerified = false
    this.verifiedAt = null
    this.createdAt = utcNow()

    return this
  }
}
