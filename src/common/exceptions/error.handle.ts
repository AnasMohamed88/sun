import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";




@Catch(HttpException)
export class AppError implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const http = host.switchToHttp()
        const req = http.getRequest()
        const res:Response = http.getResponse()
        const status = exception.getStatus()

      
        res
        .status(status)
        .json({
            errMsg:(exception.getResponse() as any).message,
            statusCode:status,
            timeStamp:new Date().toISOString(),
            // description:exception.stack
        })
    }
}