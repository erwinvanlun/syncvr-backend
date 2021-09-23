import {Body, Controller, Get, Header, Param, Post, Req, Request} from '@nestjs/common';
import {IpAddress} from 'src/lib/decorators/request-ip';
import {FibonacciService} from "./fibonacci.service";
import {RealIP} from 'nestjs-real-ip';
// @ts-ignore: todo actually this is exported, don't understand the TS error message
import {APIFibonacci, APIFibonacciHistoryRequest} from "syncvr";

@Controller(APIFibonacci.base)
export class FibonacciController {
    constructor(private service: FibonacciService) {
    }

    @Get('/' + APIFibonacci.history)
    getHistory() {
        // function for API browser testing, simply show them all
        return this.service.getHistory$({range: {after: 0, before: Infinity}});
    }

    // actually this is not a post, but a way to pass parameters for payload.
    @Post('/' + APIFibonacci.history)
     postHistory(@Body() request: APIFibonacciHistoryRequest) {
        return this.service.getHistory$(request);
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
    getFibonacci(@Param() params, @RealIP() ip: string) { // implicit any, don't like it
        return this.service.getFibonacci$(params.number, ip);
    };

    @Get()
    getHello(): string {
        return 'SyncVR Fibonacci API works! Check documentation on: '; // todo document API
    }

}
