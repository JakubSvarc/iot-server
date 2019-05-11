import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid4 from 'uuid/v4';

import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { IResult } from './interfaces/result.interface';
import { IStation01 } from './interfaces/station_types/station01.interface';
import { Logger } from '../server/server.logger';
import { IAuthenticationDTO } from '../api/interfaces/authentication.dto';

@Injectable()
export class DBWriteService {
	constructor(
		@InjectModel('User')
		private readonly userModel: Model<IUser>,

		@InjectModel('Station')
		private readonly stationModel: Model<IStation>,

		@InjectModel('Result')
		private readonly resultModel: Model<IResult>) {}

	public async register(userMeta: IUser): Promise<string> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userMeta._id} | Saving user metadata to database.`);
    	await new this.userModel(userMeta).save();
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userMeta._id} | User metadata successfully saved.`);
		return 'Registrace proběhla úspěšně.';
	}

	public async createStation(userID: string, stationMeta: IStation): Promise<string> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userID} | Saving station metadata to database.`);
		await new this.stationModel(stationMeta).save();
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userID} | Station metadata successfully saved.`);
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userID} | Writing station to user metadata.`);
		await this.userModel.updateOne({ _id: stationMeta.userID }, { $addToSet: { stations: (stationMeta.id) } }, (err: any, res: { n: number, nModified: number, ok: number }) => {
			if (res.n === 0) {
				throw new InternalServerErrorException('Stanice nebyla úspěšně vytvořena!');
			}
		});
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${userID} | Station metadata successfully wrote.`);
	  	return 'Stanice byla úspěšně vytvořena.';
    }

	public async updateLastActivity(type: 'Start' | 'End', stationID: string): Promise<void> {
		const newValue: { [key: string]: number } = {
			[`activity.last${type}`]: Date.now(),
		};
		if (type === 'Start') {
			newValue['activity.lastEnd'] = 0;
		}
		Logger.getLogger.debug(`${Date.now()} [ DB ] stationID: ${stationID} | Updating last activity.`);
		await this.stationModel.updateOne({ _id: stationID }, { $set: newValue });
		Logger.getLogger.debug(`${Date.now()} [ DB ] stationID: ${stationID} | Last activity updated successfully.`);
	}

	public async createData(stationID: string, newData: IStation01): Promise<void> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] stationID: ${stationID} | Saving data to database.`);
		await new this.resultModel({
			_id: uuid4(),
			stationID: (stationID),
			timestamp: Date.now(),
			data: newData,
		}).save();
		Logger.getLogger.debug(`${Date.now()} [ API ] stationID: ${stationID} | Data saved successfully.`);
	}
}
