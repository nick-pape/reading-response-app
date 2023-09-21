export interface IGradeOptions {
    grade: number;
    description: string;
}

export const GRADE_OPTIONS: Array<IGradeOptions> = [
    {
        grade: 0.0,
        description: "The response was blank, completely irrelevant, or appeared to be AI generated."
    },
    {
        grade: 0.4,
        description: "The response was on topic but did not reference the chapter."
    },
    {
        grade: 0.6,
        description: "The response covered the chapter but lacked a lot of detail."
    },
    {
        grade: 0.8,
        description: "The response covered the chapter but lacked some detail."
    },
    {
        grade: 1.0,
        description: "The response covered the entire chapter with sufficient detail."
    }
];