import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from './interfaces/user.interface';
import { IAuthenticationDTO } from '../api/interfaces/authentication.dto';
import { ILoginDTO } from '../api/interfaces/login.dto';

@Injectable()
export class DBAccessService {
	constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

	public async login(informations: ILoginDTO, newToken: string): Promise<IAuthenticationDTO> {
		const output: IUser = await this.userModel.findOne({ email: informations.email, password: informations.password }).select({ _id: 1 });
		if (!output) {
			throw new UnauthorizedException('Špatné uživatelské jméno nebo heslo!');
		} else {
			await this.userModel.updateOne({ email: informations.email, password: informations.password }, { $push: { tokens: newToken } });
			return {
				id: output._id,
				token: newToken,
			};
		}
    }

	public async logout(informations: IAuthenticationDTO): Promise<void> {
		await this.userModel.updateOne({ _id: informations.id }, { $pull: { tokens: informations.token } });
	}
}