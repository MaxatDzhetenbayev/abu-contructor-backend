import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Sentry.captureException(exception);

    const response = host.switchToHttp().getResponse();
    response.status(500).json({
      message: 'Internal server error',
    });
  }
}
