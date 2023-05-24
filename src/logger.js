import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const customWinstonLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'red',
        fatal: 'red'
    }
} 

winston.addColors(customWinstonLevels.colors)

const createLogger = env => {
    if (env === 'PROD') {
        return winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.File({
                    filename: 'errors.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        })
    }else{
        return winston.createLogger({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        }) 
    }
}

const logger = createLogger(process.env.ENVIRONMENT)

export default logger