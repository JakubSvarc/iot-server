import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { IAuthenticationDTO } from '../api/interfaces/authentication.dto';
import { Logger } from '../server/server.logger';

@Injectable()
export class DBReadService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>, @InjectModel('Station') private readonly stationModel: Model<IStation>) {}

	public async authentication(auth: IAuthenticationDTO): Promise<boolean> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | Authenticate access.`);
		if (await this.userModel.countDocuments({ _id: auth.id, tokens: { $in: [auth.token] } }) === 1) {
			Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | Authentication successful.`);
			return true;
		} else {
			Logger.getLogger.warn(`${Date.now()} [ DB ] userID: ${auth.id} | Authentication failed!`);
			return false;
		}
	}

	public async stationExists(stationID: string): Promise<boolean> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] stationID: ${stationID} | Checking station existence.`);
		if (await this.stationModel.countDocuments({ _id: stationID }) === 1) {
			Logger.getLogger.debug(`${Date.now()} [ DB ] stationID: ${stationID} | Station exist.`);
			return true;
		} else {
			Logger.getLogger.warn(`${Date.now()} [ DB ] stationID: ${stationID} | Station not found!`);
			return false;
		}
	}

	public async getUser(auth: IAuthenticationDTO): Promise<IUser> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | Searching user metadata.`);
		const output: IUser = await this.userModel.findOne({ _id: auth.id, tokens: { $in: [auth.token] } }).select({ _id: 0, firstName: 1, lastName: 1, email: 1, stations: 1});
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | User metadata found.`);
		return output;
	}

	public async getStationMany(auth: IAuthenticationDTO): Promise<IStation[]> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | Searching stations metadata.`);
		const output: IStation[] = await this.stationModel.find({ userID: auth.id }).select({ userID: 0 });
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${auth.id} | Stations metadata found.`);
		return output;
  	}
}
