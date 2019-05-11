import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as uuid4 from 'uuid/v4';

import { DBAccessService } from '../db/db.access.service';
import { DBWriteService } from '../db/db.write.service';
import { DBReadService } from '../db/db.read.service';
import { IUser } from '../db/interfaces/user.interface';
import { IStation } from '../db/interfaces/station.interface';
import { ILoginDTO } from './interfaces/login.dto';
import { IAuthenticationDTO } from './interfaces/authentication.dto';
import { Logger } from '../server/server.logger';

@Injectable()
export class ApiService {
	constructor(private readonly dBAccessService: DBAccessService, private readonly dBWriteService: DBWriteService, private readonly dBReadService: DBReadService) {}

	public async register(userMeta: IUser): Promise<string> {
		userMeta._id = uuid4();
		userMeta.tokens = [];
		userMeta.stations = [];
		Logger.getLogger.info(`${Date.now()} [ API ] userID: ${userMeta.id} | Registering user.`);
		const output: string = await this.dBWriteService.register(userMeta);
		Logger.getLogger.info(`${Date.now()} [ API ] userID: ${userMeta.id} | User successfully registered.`);
		return output;
	}

	public async login(login: ILoginDTO): Promise<IAuthenticationDTO> {
		const newToken: string = uuid4();
		Logger.getLogger.info(`${Date.now()} [ API ] user: ${login.email} | instance: ${newToken} | Logging user in.`);
		const output: IAuthenticationDTO = await this.dBAccessService.login(login, newToken);
		Logger.getLogger.info(`${Date.now()} [ API ] userID: ${output.id} | instance: ${newToken} | User successfully logged in.`);
    	return output;
	}

	public async logout(auth: IAuthenticationDTO): Promise<void> {
		if (await this.dBReadService.authentication(auth)) {
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | Logging user out.`);
			await this.dBAccessService.logout(auth);
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | User successfully logged out.`);
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
	}

	public async createStation(auth: IAuthenticationDTO, stationMeta: IStation): Promise<string> {
		if (await this.dBReadService.authentication(auth)) {
			stationMeta._id = uuid4();
			stationMeta.activity = { since: 0, lastStart: 0, lastEnd: 0 };
			stationMeta.activity.since = Date.now();
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${stationMeta.userID} | instance: ${auth.token} | Creating station.`);
			const output: string = await this.dBWriteService.createStation(auth.id, stationMeta);
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${stationMeta.userID} | instance: ${auth.token} | Station successfully created.`);
			return output;
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
  	}

	public async getUser(auth: IAuthenticationDTO): Promise<IUser> {
		if (await this.dBReadService.authentication(auth)) {
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | Getting user metadata.`);
			const output: IUser = await this.dBReadService.getUser(auth);
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | User metadata successfully returned.`);
			return output;
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
	}

	public async getStationMany(auth: IAuthenticationDTO): Promise<IStation[]> {
		if (await this.dBReadService.authentication(auth)) {
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | Getting stations metadata.`);
			const output: IStation[] = await this.dBReadService.getStationMany(auth);
			Logger.getLogger.info(`${Date.now()} [ API ] userID: ${auth.id} | instance: ${auth.token} | Stations metadata successfully returned.`);
			return output;
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
	}
}
