import * as React from 'react';
import { DetailsRow, GroupedList, IGroup, Selection, SelectionMode, SelectionZone, Text } from '@fluentui/react';
import { ReadingResponse } from '../../harness/api/ReadingResponse';
import { ReadingResponses } from '../../harness/api/ReadingResponses';
import { GROUP_KEYS, IUserListItems } from './useMergedListItems';

export interface IUseGroupedListProps {
    userListItems: Array<IUserListItems> | undefined;
    responses: ReadingResponses | undefined;
    groups: Array<IGroup>;
    setSelectedResponse: (response: ReadingResponse | undefined) => void;
}

export function useGroupedList(props: IUseGroupedListProps): {
    selection: Selection
    groupList: React.ReactElement
} {
    const { userListItems, responses, groups, setSelectedResponse } = props;

    // Create a selection object to keep track of selected items
    const selection = React.useMemo(() =>
        new Selection({
            onSelectionChanged: () => {
                const selected = selection.getSelection();

                if (selected.length === 0) {
                    setSelectedResponse(undefined);
                } else {
                    const response = responses?.responses.get(selected[0].key as string);
                    setSelectedResponse(response);
                }
            },
            canSelectItem: (item, index) => {
                return !GROUP_KEYS.has(item.key as string);
            },
            selectionMode: SelectionMode.multiple,
        }
    ), [setSelectedResponse, responses]);

    React.useEffect(() => {
        selection.setItems(userListItems || [], false);
    }, [userListItems, selection]);

    const onRenderCell = React.useCallback((
        nestingDepth?: number,
        item?: string,
        itemIndex?: number,
        group?: IGroup,
    ) => (
        <DetailsRow
            columns={[
                {
                    key: 'username',
                    name: 'User',
                    fieldName: 'username',
                    minWidth: 200,
                }
            ]}
            groupNestingDepth={nestingDepth}
            item={item}
            itemIndex={itemIndex!}
            selection={selection}
            selectionMode={SelectionMode.single}
            compact={true}
            group={group}
        />
    ), [selection]);

    const groupList = React.useMemo(() => {
        return userListItems ?
            <SelectionZone selection={selection} selectionMode={SelectionMode.single}>
                <GroupedList
                    items={userListItems}
                    onRenderCell={onRenderCell}
                    groups={groups}
                    selectionMode={SelectionMode.single}
                    selection={selection} // Pass the selection object
                    compact
                />
                </SelectionZone>
            : <Text variant='small'>Please load a reading response file...</Text>
    }, [userListItems, selection, groups])


    return {
        selection,
        groupList
    };
}