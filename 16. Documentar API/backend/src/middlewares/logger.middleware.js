import winston from 'winston';
import enviroment from '../config/enviroment.js';

const customLevels = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'purple',
        debug: 'grey',
      }
};

winston.addColors(customLevels.colors);

let logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ],
});

if (enviroment.ENVIROMENT === 'development') {
    logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({ level: 'debug' }),
            new winston.transports.File({ filename: 'errors.log', level: 'error' }),
        ],
    });
}

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    logger.http(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
    next();
}