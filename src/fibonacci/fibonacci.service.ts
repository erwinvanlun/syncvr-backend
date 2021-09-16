import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {APIFibonacciResultCodes} from "syncvr/dist/validation-codes";
import {APIFibonacciNumberMeta} from "syncvr";

@Injectable()
export class FibonacciService {
    async getNumber$(no: string, ip: string): Promise<number> {
        const f = this.get_fibonacci(no, ip);
        console.log('calculated fibo for ' + no + 'on backend is ' + f);
        return f;
    }

    lastRequest: number = 7;
    requests: APIFibonacciNumberMeta[] = [
        {
            requestId: 7,
            timestamp: "timestamp",
            ipAddress: "ip",
            number: 5,
            fibonacci: 24
        },
        {
            requestId: 6,
            timestamp: "timestamp",
            ipAddress: "ip",
            number: 5,
            fibonacci: 24
        },
        {
            requestId: 6,
            timestamp: "timestamp",
            ipAddress: "ip",
            number: 5,
            fibonacci: 24
        },
        {
            requestId: 5,
            timestamp: "timestamp",
            ipAddress: "ip",
            number: 5,
            fibonacci: 24
        },
        {
            requestId: 4,
            timestamp: "timestamp",
            ipAddress: "ip",
            number: 5,
            fibonacci: 24
        }

    ];

    private sequence: number[] = [];

    private get_fibonacci(no: string, ip: string): number {
        let num = Number(no);
        if (num.toString() !== no) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.NotNumeric,
        }, HttpStatus.FORBIDDEN); // todo: forbidden is actually not the correct error code
        if (num < 0) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.Negative,
        }, HttpStatus.FORBIDDEN);
        if (!checkIsInt(num)) throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: APIFibonacciResultCodes.NonInteger,
        }, HttpStatus.FORBIDDEN);

        let fibonacciResult = this.fibonacci(Number(no)); // number conversion is necessary as it appears that

        // store in request history, convert ip address to localhost
        let meta: APIFibonacciNumberMeta;
        meta =
            {
                requestId: ++this.lastRequest,
                timestamp: "timestamp",
                ipAddress: ip == '::1' ? 'localhost' : ip,
                number: Number(no),
                fibonacci: fibonacciResult
            };
        this.requests.unshift(meta);

        return fibonacciResult;
    }

    private fibonacci(num: number): number {

        if (this.sequence[num]) return this.sequence[num];
        if (num <= 1) return 1;

        let partialResult: number[] = [0, 0];

        [-1, -2].forEach((r, i) => {
            try {
                partialResult[i] = this.fibonacci(num + r);
            } catch (e) {
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

    getHistory(): APIFibonacciNumberMeta[] {
        let historyElement: APIFibonacciNumberMeta =
            {
                requestId: ++this.lastRequest,
                timestamp: "timestamp",
                ipAddress: "ip",
                number: 5,
                fibonacci: 24
            };
        this.requests.unshift(historyElement);
        return this.requests;
    }
}


// helpers fibonacci
export type Int = number & { __int__: void };
export const checkIsInt = (num: number): num is Int => num % 1 === 0;

// helpers history
const generateRandomDOB = (): string => {
    const random = getRandomDate(new Date('1950-02-12T01:57:45.271Z'), new Date('2001-02-12T01:57:45.271Z'))
    return random.toISOString();
}

function getRandomDate(from: Date, to: Date) {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
}