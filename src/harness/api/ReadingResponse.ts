export class ReadingResponse {
    private _username: string;
    private _text: string;

    public constructor(
        username: string,
        text: string
    ) {
        this._username = username;
        this._text = text;
    }
}