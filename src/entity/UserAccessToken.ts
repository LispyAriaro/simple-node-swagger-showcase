import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm"
import TableColumns, { UserAccessTokenColumns } from '../enums/TableColumns'
import Tables from "../enums/Tables"
import BaseEntity from "./BaseEntity"
import { User } from "./User";


@Entity({ name: Tables.USER_ACCESS_TOKENS })
@Index(['user', 'isActive'], { unique: true })
export class UserAccessToken extends BaseEntity {
  @Column({type: 'bigint', name: UserAccessTokenColumns.USER_ID })
  userId: number;

  @ManyToOne(type => User, user => user.accessTokens)
  @JoinColumn({name: UserAccessTokenColumns.USER_ID, referencedColumnName: TableColumns.ID})
  user: User;

  @Column({type: 'text', name: UserAccessTokenColumns.TOKEN })
  token: string;

  @Column({type: 'text', name: UserAccessTokenColumns.REFRESH_TOKEN })
  refreshToken: string;

  @Column({type: 'boolean', name: UserAccessTokenColumns.IS_ACTIVE })
  isActive: boolean;
}
