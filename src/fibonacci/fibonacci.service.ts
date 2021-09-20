import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {
    APIFibonacciHistoryResponse,
    APIFibonacciNumberMeta,
    APIFibonacciNumberRequestResponse,
    APIFibonacciResultCodes
} from "syncvr";
import {environment} from "../environments/environment";
import {timer} from "rxjs";

@Injectable()
export class FibonacciService {
    async getFibonacci$(no: string, ip: string): Promise<APIFibonacciNumberRequestResponse> {
        return this.getFibonacci(no, ip); // todo actually I wanted something like this: validate().calc().store()
    }

    constructor() {
        this.generateDummyRequests(environment.dummyHistorySize);
        timer(1, environment.dummyHistoryIntervalInSeconds * 1000).subscribe(() => this.generateDummyRequests(1));
    }

    private lastRequest: number = 0;
    private requests: APIFibonacciNumberMeta[] = [];
    private calculations: number[] = [];

    private getFibonacci(no: string, ip: string): APIFibonacciNumberRequestResponse {
        // todo: validate first, can't we share this with frontend?
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

        // the actual calculation
        let fibonacciResult = this.calcFibonacci(Number(no)); // number conversion is necessary as it appears that

        // store in request history, convert ip address to localhost
        let result: APIFibonacciNumberMeta;
        const timestamp = new Date();
        result =
            {
                requestId: ++this.lastRequest,
                timestamp: timestamp.toString(),
                ipAddress: ip == '::1' ? 'localhost' : ip,
                number: Number(no),
                fibonacci: fibonacciResult
            };
        this.requests.unshift(result);

        return {result: result, resultCode: APIFibonacciResultCodes.OK}
    }

    private calcFibonacci(num: number): number {
        if (this.calculations[num]) return this.calculations[num];
        if (num <= 1) return 1;

        let partialResult: number[] = [0, 0];

        [-1, -2].forEach((r, i) => {
            try {
                partialResult[i] = this.calcFibonacci(num + r);
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
        return this.calculations[num] = newNum;
    }

    getHistory(): APIFibonacciHistoryResponse {
        return {history: this.requests, resultCode: APIFibonacciResultCodes.OK};
    }

    generateDummyRequests(numberOfDummyRequests: number) {
        const lastRequestToAdd = this.lastRequest + numberOfDummyRequests;
        for (this.lastRequest++; this.lastRequest <= lastRequestToAdd; ++this.lastRequest) {
            const number = Math.floor(Math.random() * 40); // max number assumed to be 40
            let timestamp = new Date();
            // single dummy request are considered to have timestamp 'now'
            if (numberOfDummyRequests !== 1) {timestamp.setSeconds(timestamp.getSeconds() - (Math.floor(Math.random() * this.lastRequest * 10)));}
            const dummyRequest: APIFibonacciNumberMeta = {
                requestId: this.lastRequest,
                number: number,
                fibonacci: this.calcFibonacci(number),
                ipAddress: Math.floor(Math.random() * 256).toString() + '.'
                    + Math.floor(Math.random() * 256).toString() + '.' +
                    +Math.floor(Math.random() * 256).toString() + '.' +
                    +Math.floor(Math.random() * 256).toString(), // todo could probably be optimized
                timestamp: timestamp.toString()
            }
            this.requests.unshift(dummyRequest);
        }
        this.lastRequest--; // fix
    }
}

// helpers fibonacci
export type Int = number & { __int__: void };
export const checkIsInt = (num: number): num is Int => num % 1 === 0;
