export interface IStationOutput {
    id: string;
    type: string;
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
