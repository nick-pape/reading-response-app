import * as React from 'react';
import { IUserListItems } from '../App';
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
    usernames: Array<IUserListItems> | undefined
}

export function useGroupings(props: IUseGroupingsProps): {
    counts: IResponseCounts,
    groups: Array<IGroup>
} {
    const { usernames } = props;

    const counts: IResponseCounts = React.useMemo(() => {
        const count: IResponseCounts = {
            [NOT_GRADED_KEY]: 0,
            [NO_CREDIT_KEY]: 0,
            [PARTIAL_CREDIT_KEY]: 0,
            [FULL_CREDIT_KEY]: 0
        };

        if (!usernames) {
            return count;
        }

        usernames.map(item => {
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
    }, [usernames]);

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
    }, [usernames, counts]);

    return { counts, groups };
}