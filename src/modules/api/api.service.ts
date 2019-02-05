import { Injectable } from '@nestjs/common';

import { DBWriteService } from '../db/db.write.service';
import { DBReadService } from '../db/db.read.service';
import { IUser } from '../db/interfaces/user.interface';
import { IStation } from '../db/interfaces/station.interface';
import { ILoginDto } from './interfaces/login.dto';
import { IValidationDto } from './interfaces/validation.dto';
import { IStationOutput } from './interfaces/station.output';

@Injectable()
export class ApiService {
	constructor(private readonly dBWriteService: DBWriteService, private readonly dBReadService: DBReadService) {}

	public async register(body: IUser): Promise<string> {
    	return await this.dBWriteService.register(body);
	}

	public async login(body: ILoginDto): Promise<IValidationDto> {
    	return await this.dBReadService.login(body);
	}

	public async createStation(body: IStation): Promise<string> {
	  	return await this.dBWriteService.createStation(body);
  	}

	public async getStationMany(email: string, password: string): Promise<IStationOutput[]> {
		return await this.dBReadService.getStationMany(email, password);
	}
}
