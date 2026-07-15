import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    const message = typeof responseBody === 'string' ? responseBody : (responseBody as Record<string, string | undefined>).message ?? 'Internal error';
    const errors = typeof responseBody === 'object' ? (responseBody as Record<string, unknown>).errors : undefined;

    response.status(status).json({ statusCode: status, message, errors });
  }
}
