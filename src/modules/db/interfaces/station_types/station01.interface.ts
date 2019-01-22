import { Document } from 'mongoose';

export interface IStation01 extends Document {
    _id: string;
    inside: {
        temperature: number,
        humidity: number,
    };
    outside: {
        temperature: number,
        humidity: number,
    };
}
