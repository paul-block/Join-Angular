export interface Task {
    category: string;
    title: string;
    description: string;
    dueDate: string;
    assignedUsers: [];
    prio: string;
    status: string;
    subtasks: [];
    id: string;
    // assignedUserIDs: [];
}
