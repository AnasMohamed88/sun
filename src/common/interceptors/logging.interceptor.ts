import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";








@Injectable()
export class UniformResInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {


        return next
            .handle()
            .pipe(
                map((res) => {
                    const { data, message = "Success", status = 200 } = res
                    return {
                        message,
                        data,
                        status,
                        timeStamp: new Date(Date.now())
                    }
                })
            )

    }
}