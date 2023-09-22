import { Gradebook, IGradebook } from '../../harness/api/Gradebook';
import { ReadingResponses } from '../../harness/api/ReadingResponses';

interface IOpenFileResponse {
    responses: ReadingResponses | undefined;
    grades: Gradebook | undefined;
    parseError: string | undefined;
}

declare interface IElectronAPI {
    openFile(): Promise<IOpenFileResponse>;
    saveGrades(grades: IGradebook): Promise<void>;
}

declare const ElectronAPI: IElectronAPI;

export class Electron {
    public static async openFile(): Promise<IOpenFileResponse> {
        const { responses, grades, parseError } = await ElectronAPI.openFile();
        return {
            responses: responses ? new ReadingResponses(responses) : undefined,
            grades: !!grades && !!responses ? new Gradebook(grades) : undefined,
            parseError
        };
    }

    public static async saveGrades(grades: Gradebook): Promise<void> {
        await ElectronAPI.saveGrades(grades);
    }
} 