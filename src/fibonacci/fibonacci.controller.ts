import {Controller, Get, Param} from '@nestjs/common';
import {FibonacciService} from "./fibonacci.service";

@Controller('fibonacci')
export class FibonacciController {
    constructor(private service: FibonacciService) { }
    @Get(':id')
    get(@Param() params) {
        return this.service.getNumber(params.id);
    }
}
