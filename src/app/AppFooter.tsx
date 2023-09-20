import { CompoundButton, IStackTokens, Stack } from '@fluentui/react';
import * as React from 'react';

export interface IGradeOptions {
    grade: number;
    description: string;
}

export interface IAppFooterProps {
    gradeOptions: Array<IGradeOptions>;
    grade: number | undefined;
    onGraded: (grade: number) => void;
    disabled: boolean;
}

const themedMediumStackTokens: IStackTokens = {
    childrenGap: 's1',
    padding: 's1',
};

export function AppFooter(props: IAppFooterProps) {
    console.log("Footer grade:", props.grade);

    return <Stack
        horizontal
        grow
        verticalAlign='stretch'
        tokens={themedMediumStackTokens}
    >
        {
            props.gradeOptions.map(option => 
                <Stack.Item>
                    <CompoundButton
                        primary={props.grade===option.grade}
                        secondaryText={option.description}
                        disabled={props.disabled}
                        onClick={() => {
                            props.onGraded(option.grade)
                        }}
                        styles={{
                            root: {
                                height: "100%"
                            }
                        }}
                    >
                        {option.grade}
                    </CompoundButton>
                </Stack.Item>
            )
        }
    </Stack>;
}