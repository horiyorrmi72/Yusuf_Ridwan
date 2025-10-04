import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export const configVariables = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.dbHost as string || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER as string || 'wms',
        password: process.env.DB_PASSWORD as string || 'wms',
        database: process.env.DB_NAME as string || 'wms',
    },
    rabbit: {
        url: process.env.AMQP_URL as string || 'amqp://guest:guest@localhost:5672',
    }

}