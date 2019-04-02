import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as uuid4 from 'uuid/v4';

import { DBAccessService } from '../db/db.access.service';
import { DBWriteService } from '../db/db.write.service';
import { DBReadService } from '../db/db.read.service';
import { IUser } from '../db/interfaces/user.interface';
import { IStation } from '../db/interfaces/station.interface';
import { ILoginDTO } from './interfaces/login.dto';
import { IAuthenticationDTO } from './interfaces/authentication.dto';

@Injectable()
export class ApiService {
	constructor(private readonly dBAccessService: DBAccessService, private readonly dBWriteService: DBWriteService, private readonly dBReadService: DBReadService) {}

	public async register(userMeta: IUser): Promise<string> {
		userMeta._id = uuid4();
		userMeta.tokens = [];
		userMeta.stations = [];
    	return await this.dBWriteService.register(userMeta);
	}

	public async login(login: ILoginDTO): Promise<IAuthenticationDTO> {
		const newToken: string = uuid4();
    	return await this.dBAccessService.login(login, newToken);
	}

	public async logout(auth: IAuthenticationDTO): Promise<void> {
		if (await this.dBReadService.authorization(auth)) {
			return await this.dBAccessService.logout(auth);
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
	}

	public async createStation(stationMeta: IStation): Promise<string> {
		stationMeta._id = uuid4();
		stationMeta.activity = { since: 0, lastStart: 0, lastEnd: 0 };
		stationMeta.activity.since = Date.now();
	  	return await this.dBWriteService.createStation(stationMeta);
  	}

	public async getUser(auth: IAuthenticationDTO): Promise<IUser> {
		return await this.dBReadService.getUser(auth);
	}

	public async getStationMany(auth: IAuthenticationDTO): Promise<IStation[]> {
		if (await this.dBReadService.authorization(auth)) {
			return await this.dBReadService.getStationMany(auth);
		} else {
			throw new UnauthorizedException('Nepovolený přístup!');
		}
	}
}
