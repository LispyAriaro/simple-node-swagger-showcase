import { v4 as uuidv4 } from 'uuid'
import { Column, BaseEntity as TypeOrmBaseEntity } from "typeorm";
import TableColumns, { LocationColumns } from "../enums/TableColumns";
import { ColumnNumericTransformer } from "../utils/transformers";
import BaseEntity from "./BaseEntity";

import { Entity, Index, ManyToOne, JoinColumn } from "typeorm";
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
  
  @Column({type: 'decimal', name: LocationColumns.LATITUDE, nullable: false, transformer: new ColumnNumericTransformer() })
  latitude: number;
  
  @Column({type: 'decimal', name: LocationColumns.LONGITUDE, nullable: false, transformer: new ColumnNumericTransformer() })
  longitude: number;

  @Column({length: 255, name: LocationColumns.COUNTRY, nullable: true })
  country: string;
  
  @Column({length: 255, name: LocationColumns.STATE, nullable: true })
  city: string;
  
  @Column({length: 255, name: LocationColumns.CITY, nullable: true })
  state: string;

  initialize(name: string, address: string, 
      latitude: number, longitude: number, 
      city: string, state: string, country: string) {
    this.uuid = uuidv4()
    this.name = name

    this.address = address
    this.latitude = latitude
    this.longitude = longitude

    this.city = city
    this.state = state
    this.country = country

    this.createdAt = utcNow()

    return this
  }
}
