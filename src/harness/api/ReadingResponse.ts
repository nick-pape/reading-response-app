export interface IReadingResponse {
    username: string;
    text: string;
}

export class ReadingResponse implements IReadingResponse {
    public readonly username: string;
    public readonly text: string;

    public constructor(data: IReadingResponse) {
        this.username = data.username;
        this.text = data.text;
    }
}