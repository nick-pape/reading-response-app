import * as fs from "fs";
import { ReadingResponse } from "../api/ReadingResponse";
import { ReadingResponses } from "../api/ReadingResponses";

export class ReadingResponsesUtilities {
    private static readonly _SEPERATOR: string = '================================================================================';
    private static readonly _USERNAME_REGEX: RegExp = /Student Username:\s+([^\s]+)\n/;
    private static readonly _RESPONSE_REGEX: RegExp = /Answer:\n(.*)/s;

    public static fromDumpFile(path: string): {
        responses: ReadingResponses | undefined,
        parseError: string | undefined
     } {
        try {
            const file = fs.readFileSync(path).toString().replace('\r\n', '\n');
            const rawResponses = file.split(ReadingResponsesUtilities._SEPERATOR);

            const responses: Map<string, ReadingResponse> = new Map<string, ReadingResponse>();
            
            for (const rawResponse of rawResponses) {
                if (!rawResponse.trim()) {
                    continue;
                }

                const usernameMatch = rawResponse.match(ReadingResponsesUtilities._USERNAME_REGEX);
                const answerMatch = rawResponse.match(ReadingResponsesUtilities._RESPONSE_REGEX);

                if (!usernameMatch) {
                    throw new Error(`Unable to parse username for reading response:\n${rawResponse}`);
                }

                if (!answerMatch) {
                    throw new Error(`Unable to parse response for reading response:\n${rawResponse}`);
                }

                const username = usernameMatch[1].trim();
                const text = answerMatch[1];

                responses.set(username, new ReadingResponse({ username, text }));
            }

            return {
                responses: new ReadingResponses({ responses }),
                parseError: undefined
            };
        } catch (error) {
            console.log(error);
            return {
                responses: undefined,
                parseError: error.toString()
            };
        }
    }
}