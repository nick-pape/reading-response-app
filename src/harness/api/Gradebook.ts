export class Gradebook {
    private _grades: Map<string, number>;

    public constructor() {
        this._grades = new Map<string, number>();
    }

    public get grades(): ReadonlyMap<string, number> {
        return this._grades;
    }
}