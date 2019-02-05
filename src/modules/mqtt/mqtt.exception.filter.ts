import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { MqttException } from '../mqtt/mqtt.exception';

@Catch(MqttException)
export class MqttExceptionsFilter implements ExceptionFilter {
    catch(exception: MqttException, host: ArgumentsHost) {
		console.log(exception);
    }
}
