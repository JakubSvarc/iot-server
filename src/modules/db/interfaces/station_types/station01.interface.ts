import { Document } from 'mongoose';

export interface IStation01 extends Document {
    id: string;
    inside: {
        temperature: number,
        humidity: number,
    };
    outside: {
        temperature: number,
        humidity: number,
    };
}
// may be deleted