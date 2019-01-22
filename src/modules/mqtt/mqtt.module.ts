import { Module } from '@nestjs/common';

import { DBModule } from '../db/db.module';
import { MqttPubService } from './mqtt.pub.service';

@Module({
	imports: [DBModule],
	providers: [MqttPubService],
})
export class MqttModule {}
