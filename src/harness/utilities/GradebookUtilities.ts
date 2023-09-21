import * as fs from "fs";
import { Gradebook } from "../api/Gradebook";

export class GradebookUtilities {
    public static fromDumpFile(path: string) {
        if (!fs.existsSync(path)) {
            return new Gradebook();
        }

        const rawData = JSON.parse(fs.readFileSync(path).toString());
        console.log(rawData);

        rawData.grades = new Map(Object.entries(rawData.grades));
        return new Gradebook(rawData);
    }
}