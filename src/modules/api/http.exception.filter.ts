import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		console.log(exception.getResponse());
		res.status(exception.getStatus()).json(exception.getResponse());
    }
}
