export interface IStationOutput {
    id: string;
    type: string;
    location: {
        lat: number,
        lng: number,
    };
    activity: {
        since: number,
        lastStart: number,
        lastEnd: number,
    };
    data: { [key: string]: any };
}
