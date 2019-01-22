import { Controller, Put, Post, HttpCode, Body } from '@nestjs/common';

import { ApiService } from './api.service';
import { IUser } from '../db/interfaces/user.interface';
import { IStation } from '../db/interfaces/station.interface';
import { ILoginDto } from './interfaces/login.dto';
import { IStationOutput } from './interfaces/station.output';

@Controller()
export class ApiController {
  	constructor(private readonly appService: ApiService) {}

	@Put('user/register')
	@HttpCode(200)
  	private async register(@Body() body: IUser): Promise<string> {
    	return await this.appService.register(body);
	}

	@Post('user/login')
	@HttpCode(200)
  	private async login(@Body() body: ILoginDto): Promise<IUser> {
    	return await this.appService.login(body);
	}

	@Put('station/create')
	@HttpCode(200)
  	private async createStation(@Body() body: IStation): Promise<string> {
    	return await this.appService.createStation(body);
	}

	@Post('station/get/many')
	@HttpCode(200)
	private async getStationMany(@Body() body: {email: string, password: string}): Promise<IStationOutput[]> {
		return await this.appService.getStationMany(body.email, body.password);
	}
}
