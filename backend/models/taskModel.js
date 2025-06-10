// models/taskModel.js

class TaskModel {
    constructor(id, title, priority, description, due_date, status, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.description = description;
        this.due_date = due_date;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = TaskModel;
