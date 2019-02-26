import { Injectable } from '@nestjs/common';

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

	public async register(body: IUser): Promise<string> {
    	return await this.dBWriteService.register(body);
	}

	public async login(body: ILoginDTO): Promise<IAuthenticationDTO> {
    	return await this.dBAccessService.login(body);
	}

	public async logout(body: IAuthenticationDTO): Promise<void> {
    	return await this.dBAccessService.logout(body);
	}

	public async createStation(body: IStation): Promise<string> {
	  	return await this.dBWriteService.createStation(body);
  	}

	public async getUser(auth: IAuthenticationDTO): Promise<IUser> {
		return await this.dBReadService.getUser(auth);
	}

	public async getStationMany(auth: IAuthenticationDTO): Promise<IStation[]> {
		return await this.dBReadService.getStationMany(auth);
	}
}
