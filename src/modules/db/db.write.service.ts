import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid4 from 'uuid/v4';

import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { IResult } from './interfaces/result.interface';
import { IStation01 } from './interfaces/station_types/station01.interface';

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
		userMeta._id = uuid4();
		userMeta.stations = [];
    	await new this.userModel(userMeta).save();
		return 'User account was sucesfully created!';
	}

	public async createStation(stationMeta: IStation): Promise<string> {
		stationMeta._id = uuid4();
		stationMeta.activity = {since: 0, lastStart: 0, lastEnd: 0};
		stationMeta.activity.since = Date.now();
		await new this.stationModel(stationMeta).save();
		await this.userModel.updateOne({_id: stationMeta.userID}, {$addToSet: {stations: (stationMeta._id)}}, (err: any, res: {n: number, nModified: number, ok: number}) => {
			if (res.n === 0) {
				// throw new BadRequestException(`Station with id: '${id}' doesn't exist!`);  --------> az po tvorbe exception handleru
			}
		});
	  	return 'Station was sucesfully created!';
    }

	// remove station (db remove, user.stations -> remove)

	public async updateLastActivity(type: 'Start' | 'End', id: string): Promise<void> {
		const newValue: { [key: string]: number } = {
			[`activity.last${type}`]: Date.now(),
		};
		if (type === 'Start') {
			newValue['activity.lastEnd'] = 0;
		}
		await this.stationModel.updateOne({ _id: id }, { $set: newValue });
	}

	public async createData(stationID: string, newData: IStation01): Promise<void> {
		await new this.resultModel({
			_id: uuid4(),
			stationID: (stationID),
			timestamp: Date.now(),
			data: newData,
		}).save();
	}
}
