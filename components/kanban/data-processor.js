export function groupData(data, rowKey, columnKey) {
    if (rowKey == null)  {
        const group = Object.groupBy(data, row => row[columnKey]);

        return {
            "": group
        }
    }

    const rowGroups = Object.groupBy(data, row => row[rowKey]);

    for (const key of Object.keys(rowGroups)) {
        rowGroups[key] = Object.groupBy(rowGroups[key], row => row[columnKey]);
    }

    return rowGroups;
}