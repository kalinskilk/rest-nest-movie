import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.name?.trim() === 'UnauthorizedException' ? 401 : 500;
    console.error(exception);
    response.status(code).json({
      message: exception.message,
      statusCode: code,
    });
  }
}
