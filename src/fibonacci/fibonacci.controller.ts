import {Controller, Get, Header, Param} from '@nestjs/common';
import {FibonacciService} from "./fibonacci.service";

@Controller('fibonacci')
export class FibonacciController {
    constructor(private service: FibonacciService) { }
    @Get(':number')
    @Header ('Access-Control-Allow-Origin', '*') // necessary?
    @Header ('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT') // necessary?
    get(@Param() params) { // implicit any, don't like it
        return this.service.getNumber$(params.number );
    }
}
