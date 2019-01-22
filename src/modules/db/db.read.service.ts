import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { IStation } from './interfaces/station.interface';
import { ILoginDto } from '../api/interfaces/login.dto';
import { IStationOutput } from '../api/interfaces/station.output';

@Injectable()
export class DBReadService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>, @InjectModel('Station') private readonly stationModel: Model<IStation>) {}

	public async login(options: ILoginDto): Promise<IUser> {
		const output: IUser = await this.userModel.findOne({['email']: options.email, ['password']: options.password}).select({password: 0, stations: 0});
		/*if (!output) {
			throw new Error('Wrong username or password!');     unauthorized
		}*/
		return output;
  	}

	public async getStationMany(email: string, password: string): Promise<IStationOutput[]> {
		const output: IStation[] = await this.stationModel.find({['owner.email']: email, ['owner.password']: password}).select({owner: 0});
		return output as IStationOutput[];
  	}
}
