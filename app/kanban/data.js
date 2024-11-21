function generateRandomNames(count) {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Katie", "Michael", "Sarah", "David", "Laura"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Hernandez"];
    const names = [];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        names.push(`${firstName} ${lastName}`);
    }

    return names;
}

export function generateRecords(recordCount, staffCount) {
    const statuses = [
        "available", "in use", "under maintenance", "out of service", "retired",
        "disposed", "lost", "stolen", "reserved", "awaiting approval",
        "approved", "rejected", "in transit", "received", "installed",
        "decommissioned", "pending inspection", "inspected", "awaiting repair", "repaired"
    ];

    const descriptions = [
        "Routine check-up", "Scheduled maintenance", "Urgent repair needed", "Asset relocation", "New installation",
        "Decommissioning process", "Inspection required", "Pending approval", "Awaiting parts", "Completed task",
        "In progress", "On hold", "Awaiting inspection", "Repair completed", "Asset disposal",
        "Lost item report", "Stolen item report", "Reserved for project", "Received from supplier", "Installed successfully"
    ];

    const staffMembers = generateRandomNames(staffCount);
    const records = [];

    for (let i = 0; i < recordCount; i++) {
        const record = {
            id: i + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            staff: staffMembers[Math.floor(Math.random() * staffMembers.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            timestamp: new Date().toISOString()
        };
        records.push(record);
    }

    return records;
}