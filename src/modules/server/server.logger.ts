import * as winston from 'winston';

export class Logger {
    public static getLogger: winston.Logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
            transports: [
            new winston.transports.Console(),
        ],
    });
}