export interface IGradebook {
    grades: Map<string, number>;
}

export class Gradebook implements IGradebook {
    public readonly grades: Map<string, number>;

    public constructor();
    public constructor(data: IGradebook);
    public constructor(data?: IGradebook) {
        this.grades = data?.grades || new Map<string, number>();
    }
}