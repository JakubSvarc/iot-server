export class MqttException extends Error {
    public clientID: string;

    constructor(name: string, clientID: string, message: string) {
        super(message);
        this.name = name;
        this.clientID = clientID;
    }
}