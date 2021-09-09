import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ErrorCodes} from 'syncvr';

class NotAcceptableException implements Error {
    message: string;
    name: string;
}

@Injectable()
export class FibonacciService {
    async getNumber(no: number): Promise<number> {
        return this.fibonacci(no);
    }

    private series: number[] = [];

    fibonacci(num: number): number {
        if (num < 0) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: ErrorCodes.code,
        }, HttpStatus.FORBIDDEN);
        if (!checkIsInt(num)) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'niet eens een int!',
        }, HttpStatus.FORBIDDEN);
        if (num <= 1) return 1;
        if (this.series[num]) return this.series[num];

        const newNum = this.fibonacci(num - 1) + this.fibonacci(num - 2);
        if (newNum === Infinity) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'number te groot',
            }, HttpStatus.FORBIDDEN);
        }
        return this.series[num] = newNum;
    }
}


// helpers
export type Int = number & { __int__: void };
export const checkIsInt = (num: number): num is Int => num % 1 === 0;
