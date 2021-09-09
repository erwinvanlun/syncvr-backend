import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'SyncVR Fibonacci Is Alive!!';
  }
}
