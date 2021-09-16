import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ErrorCodes} from 'syncvr';

class NotAcceptableException implements Error {
    message: string;
    name: string;
}

@Injectable()
export class FibonacciService {
    async getNumber(no: number): Promise<number> {
        return this.get_fibonacci(no);
    }

    private series: number[] = [];

    private get_fibonacci(num: number): number {
        if (num < 0) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: ErrorCodes.FibonacciNegative,
        }, HttpStatus.FORBIDDEN);
        if (!checkIsInt(num)) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: ErrorCodes.FibonacciNonInteger,
        }, HttpStatus.FORBIDDEN);
        if (num <= 1) return 1;
        return this.fibonacci(num);
    }

    private fibonacci(num: number): number {

        if (this.series[num]) return this.series[num];

        const newNum = this.fibonacci(num - 1) + this.fibonacci(num - 2);
        if (newNum === Infinity) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ErrorCodes.FibonacciNoNumber, // should be TOO-LARGE
            }, HttpStatus.FORBIDDEN);
        }
        return this.series[num] = newNum;
    }
}


// helpers
export type Int = number & { __int__: void };
export const checkIsInt = (num: number): num is Int => num % 1 === 0;
