import { Module } from '@nestjs/common';

import { DBModule } from '../db/db.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  	imports: [DBModule],
  	controllers: [ApiController],
  	providers: [ApiService],
})
export class ApiModule {}
