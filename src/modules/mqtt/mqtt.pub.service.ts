import { Injectable, UseFilters } from '@nestjs/common';
import * as mosca from 'mosca';

import { MqttExceptionsFilter } from './mqtt.exception.filter';
import { DBReadService } from '../db/db.read.service';
import { DBWriteService } from '../db/db.write.service';
import { IPayload } from './payload.interface';
import { MqttException } from './mqtt.exception';

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
            console.log(packet.topic);
            if (!packet.topic.includes('$')) {
                if (packet.topic.includes('/save')) {
                    const payload: IPayload = JSON.parse((packet.payload).toString('utf8'));
                    await this.dBWriteService.createData((packet.topic).split('/')[1], payload.data);
                }
            }
        });

        await this.broker.on('clientConnected', async (client) => {
            console.log('Client Connected:', client.id);
            if (!client.id.includes('web')) {
                if (await this.dBReadService.stationExists(client.id)) {
                    await this.dBWriteService.updateLastActivity('Start', client.id);
                } else {
                    throw new MqttException('StationException', 'Neznámá stanice!');
                }
            }
        });

        await this.broker.on('clientDisconnected', async (client) => {
            console.log('Client Disconnected:', client.id);
            if (!client.id.includes('web')) {
                if (await this.dBReadService.stationExists(client.id)) {
                    await this.dBWriteService.updateLastActivity('End', client.id);
                } else {
                    throw new MqttException('StationException', 'Neznámá stanice!');
                }
            }
        });
    }
}
