import { ReadingResponse } from "./ReadingResponse.js";

export interface IReadingResponses {
    responses: Map<string, ReadingResponse>;
}

export class ReadingResponses implements IReadingResponses {
    public readonly responses: Map<string, ReadingResponse>;

    public constructor(
        data: IReadingResponses
    ) {
        this.responses = data.responses;
    }
}
