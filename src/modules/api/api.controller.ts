import { Controller, Put, Post, HttpCode, Body } from '@nestjs/common';

import { ApiService } from './api.service';
import { IUser } from '../db/interfaces/user.interface';
import { IStation } from '../db/interfaces/station.interface';
import { IAuthenticationDTO } from './interfaces/authentication.dto';
import { ILoginDTO } from './interfaces/login.dto';

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
  	private async login(@Body() body: ILoginDTO): Promise<IAuthenticationDTO> {
    	return await this.appService.login(body);
	}

	@Post('user/logout')
	@HttpCode(204)
  	private async logout(@Body() body: IAuthenticationDTO): Promise<void> {
    	return await this.appService.logout(body);
	}

	@Put('station/create')
	@HttpCode(200)
  	private async createStation(@Body() body: IStation): Promise<string> {
    	return await this.appService.createStation(body);
	}

	@Post('user/get')
	@HttpCode(200)
	private async getUser(@Body() body: IAuthenticationDTO): Promise<IUser> {
		return await this.appService.getUser(body);
	}

	@Post('station/get/many')
	@HttpCode(200)
	private async getStationMany(@Body() body: IAuthenticationDTO): Promise<IStation[]> {
		return await this.appService.getStationMany(body);
	}
}
