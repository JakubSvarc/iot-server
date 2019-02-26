import { Document } from 'mongoose';

export interface IStation extends Document {
    _id: string;
    name: string;
    type: string;
    userID: string;
    location: {
        lat: number,
        lng: number,
    };
    activity: {
        since: number,
        lastStart: number,
        lastEnd: number,
    };
}
