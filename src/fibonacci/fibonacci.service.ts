import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {APIFibonacciResultCodes} from "syncvr/dist/validation-codes";

@Injectable()
export class FibonacciService {
    async getNumber$(no: string): Promise<number> {
        console.log('getting number for ' + no);
        console.log('typeof no is nu ' + typeof(no));

        const f = this.get_fibonacci(no);
        console.log('calculated fibo on backend is ' + f);
        return f;
    }

 //   stubResponse: FibonacciNumberResponse[] = [];

    private sequence: number[] = [];

    private get_fibonacci(no: string): number {
        let num = Number(no);
        if (num.toString() !== no) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.NotNumeric,
        }, HttpStatus.FORBIDDEN);
        if (num < 0) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.Negative,
        }, HttpStatus.FORBIDDEN);
        if (!checkIsInt(num)) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.NonInteger,
        }, HttpStatus.FORBIDDEN);

        return this.fibonacci(Number(no)); // number conversion is necessary as it appears that
    }

    private fibonacci(num: number): number {

        if (this.sequence[num]) return this.sequence[num];
        if (num <= 1) return 1;

        let partialResult: number[] = [0,0];

        [-1, -2].forEach((r, i) => {
            try {
                partialResult[i] = this.fibonacci(num + r);
            }
            catch(e){
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: APIFibonacciResultCodes.ToLarge,
                }, HttpStatus.FORBIDDEN);
            }
        });

        const newNum = partialResult[0] + partialResult[1];
        if (newNum === Infinity) {
            console.log('too large');
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: APIFibonacciResultCodes.ToLarge,
            }, HttpStatus.FORBIDDEN);
        }
        return this.sequence[num] = newNum;
    }

    // private getHistory (){
    //     this.stubResponse = [
    //         {
    //             requestId: 7,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         },
    //         {
    //             requestId: 6,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         },
    //         {
    //             requestId: 6,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         },
    //         {
    //             requestId: 5,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         },
    //         {
    //             requestId: 4,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         }
    //
    //     ];
    //
    //     let requestId = 8;
    //     let historyElement: FibonacciNumberResponse =
    //         {requestId: 7,
    //             timestamp: "timestamp",
    //             ipAddress: "ip",
    //             number: 5,
    //             fibonacci: 24
    //         };
    //
    //     let ReturnValue = of(this.stubResponse);
    //     setInterval(()=>{
    //         this.stubResponse.unshift({...historyElement, requestId: requestId++} );
    //         console.log(this.stubResponse);
    //         ReturnValue.next();
    //
    //     }, 2000);
    //
    // }
}


// helpers
export type Int = number & { __int__: void };
export const checkIsInt = (num: number): num is Int => num % 1 === 0;
