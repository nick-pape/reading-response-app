import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from "@fluentui/react";

export interface ICommandBarProps {
    onLoadFile: () => void;
    onReview: () => void;
    onNext: () => void;
    onBack: () => void;
    hasLoadedFile: boolean;
}

export function AppCommandBar(props: ICommandBarProps) {
    const _items: ICommandBarItemProps[] = [
        {
          key: 'loadFile',
          text: 'Load',
          iconProps: { iconName: 'OpenFile' },
          onClick: props.onLoadFile
        },
        {
            key: 'review',
            text: 'Review',
            iconProps: { iconName: 'DecisionSolid' },
            onClick: props.onReview,
            disabled: !props.hasLoadedFile
        }
    ];

    const _farItems: ICommandBarItemProps[] = [
        {
            key: 'back',
            text: 'Back',
            iconProps: { iconName: 'ChevronLeftMed' },
            onClick: props.onBack,
            disabled: !props.hasLoadedFile
        },
        {
            key: 'next',
            text: 'Next',
            iconProps: { iconName: 'ChevronRightMed' },
            onClick: props.onNext,
            disabled: !props.hasLoadedFile
        }
    ];

    return <CommandBar
        items={_items}
        farItems={_farItems}
    />

}