import { Schema } from 'mongoose';

export const stationSchema: Schema = new Schema({
    _id: String,
    type: String,
    userID: String,
    location: {
        lat: Number,
        lng: Number,
    },
    activity: {
        since: Number,
        last: Number,
    },
    data: {},
}, {
    versionKey: false,
});
