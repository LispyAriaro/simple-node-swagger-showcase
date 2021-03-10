import { v4 as uuidv4 } from 'uuid'
import { Column } from "typeorm";
import { LocationColumns } from "../enums/TableColumns";
import BaseEntity from "./BaseEntity";

import { Entity } from "typeorm";
import Tables from "../enums/Tables";
import { utcNow } from '../utils/core';


@Entity({ name: Tables.LOCATIONS })
export class Location extends BaseEntity {
  @Column({name: LocationColumns.UUID, unique: true })
  uuid: string;

  @Column({length: 255, name: LocationColumns.NAME, nullable: true })
  name: string;

  @Column({length: 255, name: LocationColumns.ADDRESS, nullable: false })
  address: string;
  
  initialize(name: string, address: string) {
    this.uuid = uuidv4()
    this.name = name
    this.address = address

    this.createdAt = utcNow()

    return this
  }
}
