import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DBReadService } from './db.read.service';
import { DBWriteService } from './db.write.service';
import { userSchema } from './schemas/user.schema';
import { stationSchema } from './schemas/station.schema';
import { resultSchema } from './schemas/result.schema';

@Module({
  	imports: [
		MongooseModule.forRoot('mongodb://127.0.0.1:27017/ziot'),
		MongooseModule.forFeature([{ name: 'User', schema: userSchema}, { name: 'Station', schema: stationSchema}, { name: 'Result', schema: resultSchema}]),
	],
  	controllers: [],
	providers: [DBReadService, DBWriteService],
	exports: [DBReadService, DBWriteService],
})
export class DBModule {}
