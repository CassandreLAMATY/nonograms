import winston, { Logger as WinstonLogger, format, transports } from 'winston';
import chalk from 'chalk';

const customFormat: winston.Logform.Format = format.printf((info: winston.Logform.TransformableInfo) => {
    const { level, message, timestamp } = info;
    const logLevel: string = format.colorize().colorize(level, level);
    const logMessage: string = (level === 'error' || level === 'info')  
        ? format.colorize().colorize(level, message) 
        : chalk.white(message);
    const logTimestamp: string = chalk.gray(timestamp);
    
    return `${chalk.bold('[')}${logTimestamp}${chalk.bold(']')} ${chalk.bold(logLevel)} - ${logMessage}`;
});

const Logger: WinstonLogger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD @ HH:mm:ss' }),
    customFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console()
  ],
});

export default Logger;