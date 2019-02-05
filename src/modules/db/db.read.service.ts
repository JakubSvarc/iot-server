import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid4 from 'uuid/v4';

import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { IValidationDto } from '../api/interfaces/validation.dto';
import { ILoginDto } from '../api/interfaces/login.dto';
import { IStationOutput } from '../api/interfaces/station.output';
import { MqttException } from '../mqtt/mqtt.exception';

@Injectable()
export class DBReadService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>, @InjectModel('Station') private readonly stationModel: Model<IStation>) {}

	public async login(options: ILoginDto): Promise<IValidationDto> {
		console.log(options.email);

		const output: IUser = await this.userModel.findOne({ email: options.email, password: options.password }).select({
			firstName: 0,
			lastName: 0,
			email: 0,
			password: 0,
			stations: 0,
		});
		if (!output) {
			throw new UnauthorizedException('Wrong username or password!');
		}
		const newToken: string = uuid4();
		await this.userModel.updateOne({ email: options.email, password: options.password }, { $set: { token: newToken } });
		return {
			id: output._id,
			token: newToken,
		};
	}

	public async getStationMany(email: string, password: string): Promise<IStationOutput[]> {
		const output: IStation[] = await this.stationModel.find({['owner.email']: email, ['owner.password']: password}).select({owner: 0});
		return output as IStationOutput[];
  	}

	public async stationExists(stationID: string): Promise<boolean> {
		if (await this.stationModel.countDocuments({_id: stationID}) === 1) {
			return true;
		} else {
			throw new MqttException('StationException', 'Unknown station!');
		}
	}
}
