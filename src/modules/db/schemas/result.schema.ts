import { Schema } from 'mongoose';

export const resultSchema: Schema = new Schema({
    _id: String,
    stationID: String,
    timestamp: Number,
    data: {},
}, {
    versionKey: false,
});
