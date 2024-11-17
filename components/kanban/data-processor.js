export function groupData(data, rowKey, columnKey) {
    if (rowKey == null)  {
        const group = Object.groupBy(data, ({columnKey}) => columnKey);

        return {
            "": group
        }
    }

    const rowGroups = Object.groupBy(data, ({rowKey}) => rowKey);

    for (const key of Object.keys(rowGroups)) {
        rowGroups[key] = Object.groupBy(rowGroups[key], ({columnKey}) => columnKey);
    }

    return rowGroups;
}