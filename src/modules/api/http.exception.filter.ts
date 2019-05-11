import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

import { Logger } from '../server/server.logger';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		let message: string = exception.message.message;
		if (message === 'Špatné uživatelské jméno nebo heslo!') {
			message = 'Wrong username or password!';
		} else if (message === 'Stanice nebyla úspěšně vytvořena!') {
			message = 'Station creating failed!';
		} else if (message === 'Nepovolený přístup!') {
			message = 'Unauthorized access!';
		}
		if (exception.message.statusCode === 500) {
			Logger.getLogger.error(`${Date.now()} [ API ] | code: ${exception.message.statusCode} | name: ${exception.message.error} | ${message}`);
		} else {
			Logger.getLogger.warn(`${Date.now()} [ API ] | code: ${exception.message.statusCode} | name: ${exception.message.error} | ${message}`);
		}
		res.status(exception.message.statusCode).json(message);
    }
}
