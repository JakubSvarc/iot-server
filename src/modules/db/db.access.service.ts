import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from './interfaces/user.interface';
import { IAuthenticationDTO } from '../api/interfaces/authentication.dto';
import { ILoginDTO } from '../api/interfaces/login.dto';
import { Logger } from '../server/server.logger';

@Injectable()
export class DBAccessService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

	public async login(informations: ILoginDTO, newToken: string): Promise<IAuthenticationDTO> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] user: ${informations.email} | Searching user in database.`);
		const output: IUser = await this.userModel.findOne({ email: informations.email, password: informations.password }).select({ _id: 1 });
		if (!output) {
			throw new UnauthorizedException('Špatné uživatelské jméno nebo heslo!');
		} else {
			Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${output._id} | User found successfully.`);
			Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${output._id} | Writing login token to database.`);
			await this.userModel.updateOne({ email: informations.email, password: informations.password }, { $push: { tokens: newToken } });
			Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${output._id} | Writing successful.`);
			return {
				id: output._id,
				token: newToken,
			};
		}
	}

	public async logout(informations: IAuthenticationDTO): Promise<void> {
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${informations.id} | Deleting login token from database.`);
		await this.userModel.updateOne({ _id: informations.id }, { $pull: { tokens: informations.token } });
		Logger.getLogger.debug(`${Date.now()} [ DB ] userID: ${informations.id} | Delete successful.`);
	}
}