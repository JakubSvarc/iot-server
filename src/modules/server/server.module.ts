import { Module } from '@nestjs/common';

import { ApiModule } from '../api/api.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { DBModule } from '../db/db.module';

@Module({
 	imports: [ApiModule, MqttModule, DBModule],
})
export class ServerModule {}
