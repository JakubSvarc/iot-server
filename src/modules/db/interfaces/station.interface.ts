import { Document } from 'mongoose';

export interface IStation extends Document {
    _id: string;
    type: string;
    userID: string;
    location: {
        lat: number,
        lng: number,
    };
    activity: {
        since: number,
        last: number,
    };
    data: {
        [key: string]: any,
    };
}
