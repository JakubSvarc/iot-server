import { Schema } from 'mongoose';

export const stationSchema: Schema = new Schema({
    _id: String,
    name: String,
    type: String,
    userID: String,
    location: {
        lat: Number,
        lng: Number,
    },
    activity: {
        since: Number,
        lastStart: Number,
        lastEnd: Number,
    },
}, {
    versionKey: false,
});
