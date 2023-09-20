import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from "@fluentui/react";

export interface ICommandBarProps {
    onLoadFile: () => void;
    onReview: () => void;
}

export function AppCommandBar(props: ICommandBarProps) {
    const _items: ICommandBarItemProps[] = [
        {
          key: 'loadFile',
          text: 'Load',
          iconProps: { iconName: 'OpenFile' },
          onClick: props.onLoadFile
        }
    ];

    const _farItems: ICommandBarItemProps[] = [
        {
            key: 'tile',
            text: 'Review',
            iconProps: { iconName: 'DecisionSolid' },
            onClick: props.onReview
        }
    ];

    return <CommandBar
        items={_items}
        farItems={_farItems}
    />

}