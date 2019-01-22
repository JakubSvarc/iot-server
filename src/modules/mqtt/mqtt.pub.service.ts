import { Injectable } from '@nestjs/common';
import * as mosca from 'mosca';

import { DBWriteService } from '../db/db.write.service';
import { IPayload } from './payload.interface';

@Injectable()
export class MqttPubService {
    private readonly broker: mosca.Server = new mosca.Server({port: 1883});

    public constructor(private readonly dBWriteService: DBWriteService) {
        this.run();
    }

    public async run(): Promise<void> {
        await this.broker.on('published', async (packet: mosca.Packet, client: mosca.Client) => {
            console.log(packet.topic);
            if (!packet.topic.includes('$')) {
                if (packet.topic.includes('/connect')) {
                    // kontrola, jestli station existuje, jinak err (refused exception)
                    await this.dBWriteService.updateLastActivity(packet.topic.split('/')[1]);
                } else {
                    const payload: IPayload = JSON.parse((packet.payload).toString('utf8'));
                    // error kdyz neni JSON
                    if (payload.save) {
                        await this.dBWriteService.createData((packet.topic).split('/')[1], payload.data);
                    }
                }
            }
        });
    }
}
