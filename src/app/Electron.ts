import { type IReadingResponses, ReadingResponses } from '../harness/api/ReadingResponses';

declare interface IElectronAPI {
    openFile(): Promise<IReadingResponses | undefined>;
}

declare const ElectronAPI: IElectronAPI;

export class Electron {
    public static openFile(): Promise<ReadingResponses | undefined> {
        return ElectronAPI.openFile().then((data) => data ? new ReadingResponses(data) : undefined);
    }
} 