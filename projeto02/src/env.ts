import 'dotenv/config'

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_CLIENT: process.env.DATABASE_CLIENT || 'sqlite',
  DATABASE_URL: process.env.DATABASE_URL || './db/app.db',
}
