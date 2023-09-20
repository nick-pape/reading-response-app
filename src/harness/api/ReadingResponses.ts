import * as fs from "fs";
import { ReadingResponse } from "./ReadingResponse";

export class ReadingResponses {
    private static SEPERATOR = '================================================================================';
    private static USERNAME_REGEX = /Student Username:\s+([^\s]+)\n/;
    private static RESPONSE_REGEX = /Answer:\n(.*)/s;

    private _readingResponses: Map<string, ReadingResponse>;

    public get responses(): ReadonlyMap<string, ReadingResponse> {
        return this._readingResponses;
    }

    private constructor(
        readingResponses: Map<string, ReadingResponse>
    ) {
        this._readingResponses = readingResponses;
    }

    public static fromDumpFile(path: string) {
        const file = fs.readFileSync(path).toString().replace('\r\n', '\n');
        const rawResponses = file.split(ReadingResponses.SEPERATOR);

        const result: Map<string, ReadingResponse> = new Map<string, ReadingResponse>();

        let i = 0;
        for (const rawResponse of rawResponses) {
            if (!rawResponse.trim()) {
                continue;
            }

            const usernameMatch = rawResponse.match(this.USERNAME_REGEX);
            const answerMatch = rawResponse.match(this.RESPONSE_REGEX);

            if (!usernameMatch) {
                throw new Error('Unable to parse username for reading response');
            }

            if (!answerMatch) {
                throw new Error('Unable to parse response for reading response');
            }

            const username = usernameMatch[1].trim();
            const response = answerMatch[1];

            result.set(username, new ReadingResponse(username, response));
        }

        return new ReadingResponses(result);
    }
}