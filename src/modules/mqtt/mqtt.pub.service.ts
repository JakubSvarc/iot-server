import { Injectable } from '@nestjs/common';
import * as mosca from 'mosca';

import { DBReadService } from '../db/db.read.service';
import { DBWriteService } from '../db/db.write.service';
import { IPayload } from './payload.interface';

@Injectable()
export class MqttPubService {
    private readonly broker: mosca.Server = new mosca.Server({port: 1883});

    public constructor(private readonly dBReadService: DBReadService, private readonly dBWriteService: DBWriteService) {
        this.run();
    }

    public async run(): Promise<void> {
        await this.broker.on('published', async (packet: mosca.Packet, client: mosca.Client) => {
            console.log(packet.topic);
            if (!packet.topic.includes('$')) {
                if (packet.topic.includes('/save')) {
                    const payload: IPayload = JSON.parse((packet.payload).toString('utf8'));
                    // if (!(payloa)
                    await this.dBWriteService.createData((packet.topic).split('/')[1], payload.data);
                }
            }
        });

        await this.broker.on('clientConnected', async (client) => {
            console.log('Client Connected:', client.id);
            if (await this.dBReadService.stationExists(client.id)) {
                await this.dBWriteService.updateLastActivity('Start', client.id);
            }
        });

        await this.broker.on('clientDisconnected', async (client) => {
            console.log('Client Disconnected:', client.id);
            if (await this.dBReadService.stationExists(client.id)) {
                await this.dBWriteService.updateLastActivity('End', client.id);
            }
        });
    }
}
