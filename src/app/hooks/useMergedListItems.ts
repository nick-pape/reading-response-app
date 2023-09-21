import * as React from 'react';
import { ReadingResponses } from '../../harness/api/ReadingResponses';
import { Gradebook } from '../../harness/api/Gradebook';
import { IGroup } from '@fluentui/react';

export const NOT_GRADED_KEY: 'Not Graded' = 'Not Graded';
export const NO_CREDIT_KEY: 'No Credit' = 'No Credit';
export const PARTIAL_CREDIT_KEY: 'Partial Credit' = 'Partial Credit';
export const FULL_CREDIT_KEY: 'Full Credit' = 'Full Credit';

export interface IResponseCounts {
    [NOT_GRADED_KEY]: number;
    [NO_CREDIT_KEY]: number;
    [PARTIAL_CREDIT_KEY]: number;
    [FULL_CREDIT_KEY]: number;
}

export const GROUP_KEYS: Set<string> = new Set<string>([NOT_GRADED_KEY, NO_CREDIT_KEY, PARTIAL_CREDIT_KEY, FULL_CREDIT_KEY]);


export interface IUseGroupingsProps {
    responses: ReadingResponses | undefined;
    gradebookData: Gradebook | undefined;
}

export interface IUserListItems {
    key: string;
    username: string;
    grade: number | undefined;
}

export function useMergedListItems(props: IUseGroupingsProps): {
    userListItems: Array<IUserListItems> | undefined;
    counts: IResponseCounts;
    groups: Array<IGroup>
} {
    const { responses, gradebookData } = props;

    const userListItems: Array<IUserListItems> | undefined = React.useMemo(() => {
        if (responses && gradebookData) {
            const list = [...responses.responses.keys()].map((username) => {
                return {
                    key: username,
                    username,
                    grade: gradebookData.grades.get(username)
                };
            });

            // Sort the list by grade
            list.sort((a, b) => {
                // Check for undefined grades
                if (a.grade === undefined && b.grade === undefined) {
                    return a.username > b.username ? 1 : -1;
                } else if (a.grade === undefined) {
                    return -1;
                } else if (b.grade === undefined) {
                    return 1;
                } else {
                    // Compare numeric grades
                    if (a.grade === b.grade) {
                        return a.username > b.username ? 1 : -1;
                    }
                    return a.grade - b.grade;
                }
            });

            return list;
        }
        return undefined;
    }, [responses, gradebookData]);

    const counts: IResponseCounts = React.useMemo(() => {
        const count: IResponseCounts = {
            [NOT_GRADED_KEY]: 0,
            [NO_CREDIT_KEY]: 0,
            [PARTIAL_CREDIT_KEY]: 0,
            [FULL_CREDIT_KEY]: 0
        };

        if (!userListItems) {
            return count;
        }

        userListItems.map(item => {
            if (item.grade === undefined) {
                count[NOT_GRADED_KEY] += 1;
            } else if (item.grade === 1.0) {
                count[FULL_CREDIT_KEY] += 1;
            } else if (item.grade === 0.0) {
                count[NO_CREDIT_KEY] += 1;
            } else {
                count[PARTIAL_CREDIT_KEY] += 1;
            }
        });

        return count;
    }, [userListItems]);

    // Create two groups: 'In Gradebook' and 'Not In Gradebook'
    const groups = React.useMemo(() => {
        let indexSoFar: number = 0;

        return [NOT_GRADED_KEY, NO_CREDIT_KEY, PARTIAL_CREDIT_KEY, FULL_CREDIT_KEY].reduce((prev: IGroup[], key: string) => {
            const count = counts[key as keyof IResponseCounts];
            if (count !== 0) {
                prev.push({
                    key,
                    name: key,
                    startIndex: indexSoFar,
                    count
                });
                indexSoFar += count;
            }
            return prev;
        }, [] as IGroup[]);
    }, [userListItems, counts]);

    return { userListItems, counts, groups };
}