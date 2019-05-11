import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { MqttException } from '../mqtt/mqtt.exception';
import { Logger } from '../server/server.logger';

@Catch(MqttException)
export class MqttExceptionsFilter implements ExceptionFilter {
    catch(exception: MqttException, host: ArgumentsHost) {
		Logger.getLogger.warn(`${Date.now()} [ MQTT ] clientID: ${exception.clientID} | name: ${exception.name} | ${exception.message}`);
    }
}
