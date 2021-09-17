import {Controller, Get, Header, Param} from '@nestjs/common';
import {IpAddress} from 'src/lib/decorators/request-ip';
import {FibonacciService} from "./fibonacci.service";
import {RealIP} from 'nestjs-real-ip';
// @ts-ignore: todo actually this is exported, don't understand the TS error message
import {APIFibonacci} from "syncvr";

@Controller(APIFibonacci.base)
export class FibonacciController {
    constructor(private service: FibonacciService) {
    }

    @Get('/' + APIFibonacci.history)
    @Header('Access-Control-Allow-Origin', '*') // necessary?
    @Header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT') // necessary?
    getHistory() {
        console.log('in getHistory!');

        return this.service.getHistory();
    }

    @Get('my-ip') // client tool to determine own ip address
    get(@RealIP() ip: string): string {
        // ::1 is the compressed format IPV6 loopback address 0:0:0:0:0:0:0:1.
        // It is the equivalent of the IPV4 address 127.0. 0.1.
        return ip == '::1' ? 'localhost' : ip;
    }

    @Get(APIFibonacci.calc + ':number') // todo this actually doesn't work when calc differs from ''
    @Header('Access-Control-Allow-Origin', '*') // necessary?
    @Header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT') // necessary?
    getNumber(@Param() params, @RealIP() ip: string) { // implicit any, don't like it
        return this.service.getNumber$(params.number, ip);
    };

    @Get()
    getHello(): string {
        return 'SyncVR Fibonacci API works! Check documentation on: '; // todo document API
    }

}
