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

export function AppFooter(props: IAppFooterProps): React.ReactElement {
    return <Stack
        horizontal
        grow
        horizontalAlign='center'
        verticalAlign='stretch'
        tokens={themedMediumStackTokens}
    >
        {
            props.gradeOptions.map(option => 
                <GradeButton
                    key={option.grade}
                    option={option}
                    primary={props.grade===option.grade}
                    disabled={props.disabled}
                    onClick={props.onGraded}
                />
            )
        }
    </Stack>;
}

interface IGradeButtonProps {
    option: IGradeOptions;
    primary: boolean;
    disabled: boolean;
    onClick: (grade: number) => void;
}
function GradeButton(props: IGradeButtonProps): React.ReactElement {
    const { option, primary, disabled, onClick } = props;

    const clickCallback = React.useCallback(() => {
        onClick(option.grade);
    }, [onClick, option]);

    return <Stack.Item>
        <CompoundButton
            primary={primary}
            secondaryText={option.description}
            disabled={disabled}
            onClick={clickCallback}
            styles={{
                root: {
                    height: "100%"
                }
            }}
        >
            {option.grade}
        </CompoundButton>
    </Stack.Item>
}