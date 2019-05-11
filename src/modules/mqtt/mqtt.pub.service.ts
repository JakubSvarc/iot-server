import { Injectable, UseFilters } from '@nestjs/common';
import * as mosca from 'mosca';

import { MqttExceptionsFilter } from './mqtt.exception.filter';
import { DBReadService } from '../db/db.read.service';
import { DBWriteService } from '../db/db.write.service';
import { IPayload } from './interfaces/payload.interface';
import { MqttException } from './mqtt.exception';
import { Logger } from '../server/server.logger';

@Injectable()
@UseFilters(new MqttExceptionsFilter())
export class MqttPubService {
    private readonly broker: mosca.Server = new mosca.Server({
        http: {
            port: 1884,
            bundle: true,
            static: './',
        },
    });

    public constructor(private readonly dBReadService: DBReadService, private readonly dBWriteService: DBWriteService) {
        this.run();
    }

    public async run(): Promise<void> {
        await this.broker.on('published', async (packet: mosca.Packet, client: mosca.Client) => {
            if (!packet.topic.includes('$')) {
                Logger.getLogger.info(`${Date.now()} [ MQTT ] topic: ${packet.topic} | Message successfully arived.`);
                if (packet.topic.includes('/save')) {
                    const payload: IPayload = JSON.parse((packet.payload).toString('utf8'));
                    await this.dBWriteService.createData((packet.topic).split('/')[1], payload.data);
                }
            }
        });

        await this.broker.on('clientConnected', async (client) => {
            if (!client.id.includes('web')) {
                if (await this.dBReadService.stationExists(client.id)) {
                    await this.dBWriteService.updateLastActivity('Start', client.id);
                    Logger.getLogger.info(`${Date.now()} [ MQTT ] clientID: ${client.id} | Station client successfully connected.`);
                } else {
                    throw new MqttException('StationException', client.id, 'Unknown station!');
                }
            } else {
                Logger.getLogger.info(`${Date.now()} [ MQTT ] clientID: ${client.id} | Web client successfully connected.`);
            }
        });

        await this.broker.on('clientDisconnected', async (client) => {
            if (!client.id.includes('web')) {
                if (await this.dBReadService.stationExists(client.id)) {
                    await this.dBWriteService.updateLastActivity('End', client.id);
                    Logger.getLogger.info(`${Date.now()} [ MQTT ] clientID: ${client.id} | Station client successfully disconnected.`);
                } else {
                    throw new MqttException('StationException', client.id, 'Unknown station!');
                }
            } else {
                Logger.getLogger.info(`${Date.now()} [ MQTT ] clientID: ${client.id} | Web client successfully disconnected.`);
            }
        });
    }
}
