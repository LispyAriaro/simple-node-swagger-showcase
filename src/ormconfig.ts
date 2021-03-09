import { ConnectionOptions } from 'typeorm'

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOSTNAME,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    __dirname + '/entity/**/*{.ts,.js}',
  ],
  migrations: [
  ],
  synchronize: true,
  // logging: process.env.NODE_ENV !== 'production'
}

export default config
