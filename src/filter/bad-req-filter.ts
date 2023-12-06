import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isArray, } from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {


    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = exception.getStatus();
        const responseError = exception.getResponse() as any;
        let errors;
        if (
            isArray(responseError.message)
        ) {
            response.status(statusCode).json({
                statusCode,
                code: responseError.code || responseError.type,
                errors: responseError.message,
                message: exception.message,
            });

        } else {

            response.status(statusCode).json({
                statusCode,
                code: responseError.code || responseError.type,
                errors,
                message: exception.message,
            });
        }


    }

}
