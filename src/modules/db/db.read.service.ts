import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { IAuthenticationDTO } from '../api/interfaces/authentication.dto';

@Injectable()
export class DBReadService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>, @InjectModel('Station') private readonly stationModel: Model<IStation>) {}

	public async getUser(auth: IAuthenticationDTO): Promise<IUser> {
		const output: IUser = await this.userModel.findOne({ _id: auth.id, tokens: { $in: [auth.token] } }).select({ _id: 0, firstName: 1, lastName: 1, email: 1, stations: 1});
		if (!output) {
			throw new UnauthorizedException('Nepovolený přístup!');
		} else {
			return output;
		}
	}

	public async getStationMany(auth: IAuthenticationDTO): Promise<IStation[]> {
		if (await this.userModel.countDocuments({ _id: auth.id, tokens: { $in: [auth.token] } }) !== 1) {
			throw new UnauthorizedException('Nepovolený přístup!');
		} else {
			return await this.stationModel.find({ userID: auth.id }).select({ userID: 0 });
		}
  	}

	public async stationExists(stationID: string): Promise<boolean> {
		if (await this.stationModel.countDocuments({ _id: stationID }) === 1) {
			return true;
		} else {
			return false;
		}
	}
}
