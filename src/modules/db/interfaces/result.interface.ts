import { Document } from 'mongoose';

import { IStation01 } from './station_types/station01.interface';

export interface IResult extends Document {
    _id: string;
    stationID: string;
    timestamp: number;
    data: IStation01; // | IStation02 | ...
}
