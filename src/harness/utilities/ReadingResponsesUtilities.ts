import * as fs from "fs";
import { ReadingResponse } from "../api/ReadingResponse";
import { ReadingResponses } from "../api/ReadingResponses";

export class ReadingResponsesUtilities {
    private static SEPERATOR = '================================================================================';
    private static USERNAME_REGEX = /Student Username:\s+([^\s]+)\n/;
    private static RESPONSE_REGEX = /Answer:\n(.*)/s;

    public static fromDumpFile(path: string) {
        const file = fs.readFileSync(path).toString().replace('\r\n', '\n');
        const rawResponses = file.split(ReadingResponsesUtilities.SEPERATOR);

        const responses: Map<string, ReadingResponse> = new Map<string, ReadingResponse>();
        
        for (const rawResponse of rawResponses) {
            if (!rawResponse.trim()) {
                continue;
            }

            const usernameMatch = rawResponse.match(ReadingResponsesUtilities.USERNAME_REGEX);
            const answerMatch = rawResponse.match(ReadingResponsesUtilities.RESPONSE_REGEX);

            if (!usernameMatch) {
                throw new Error('Unable to parse username for reading response');
            }

            if (!answerMatch) {
                throw new Error('Unable to parse response for reading response');
            }

            const username = usernameMatch[1].trim();
            const text = answerMatch[1];

            responses.set(username, new ReadingResponse({ username, text }));
        }

        return new ReadingResponses({ responses });
    }
}