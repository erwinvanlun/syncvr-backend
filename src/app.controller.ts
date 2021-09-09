import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ErrorCodes} from "syncvr";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return ErrorCodes.FibonacciNonInteger;
  }


}
