import { IStation01 } from '../db/interfaces/station_types/station01.interface';

export interface IPayload {
    save: string;
    data: IStation01;
}
