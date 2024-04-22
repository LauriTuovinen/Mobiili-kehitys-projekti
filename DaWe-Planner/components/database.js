import * as SQLite from "expo-sqlite"
import { useState, useEffect } from 'react';

export const db = SQLite.openDatabase("DaWe.db");

//This creates a new table if table doesn't exist yet
export const createDB = (db) => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, priority INT, date TEXT NOT NULL, startTime TEXT, endTime TEXT, description TEXT, image TEXT, notification INT NOT NULL, tag TEXT, done INT NOT NULL )")
    });
    console.log("Task Table Created!");
}
//This is for removing tables from database

export const dropTaskTable = (db) => {
    db.transaction(tx => {
        tx.executeSql("DELETE FROM tasks")
    });
    console.log("Tasks deleted ");
}

export const dropTable = (db) => {
    db.transaction(tx => {
        tx.executeSql("DROP TABLE IF EXISTS tasks")
    });
    console.log("Tasks deleted ");
}


// Logic for adding a task
/*
export const addTask = (db, taskName, description, priority, date, startTime, endTime, notification) => {
    db.transaction(tx => {
        tx.executeSql("INSERT INTO tasks (name, description, priority, date, startTime, endTime, notification, tag) values (?, ?, ?, ?, ?, ?, ?, ?)",
            [taskName, description, priority, date, startTime, endTime, notification],
            
        );
        console.log("Task added!");
    });
}
*/

//Logic for adding tasks to database
export const addTask = (db, taskName, description, priority, date, startTime, endTime, image, notification, tag, done) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO tasks (name, description, priority, date, startTime, endTime, image, notification, tag, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [taskName, description, priority, date, startTime, endTime, image, notification, tag, 0],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        console.log("Task added!");
                        resolve(); // Resolve the Promise if the task was successfully added
                    } else {
                        reject(new Error("Failed to add task")); // Reject the Promise if no rows were affected
                    }
                },
                (_, error) => {
                    reject(error); // Reject the Promise if an error occurred during the transaction
                }
            );
        });
    });
};
//Logic for deleting tasks
export const deleteTask = (db, id) => {
    db.transaction(tx => {
        tx.executeSql("DELETE FROM tasks WHERE id = ?", [id],

        );
        console.log("Task deleted");
    });
};
//Logic for updating tasks
export const updateTask = (db, id) => {
    db.transaction(tx => {
        tx.executeSql("UPDATE tasks SET name = ? WHERE id = ?", [currentTask, id],
        );
        console.log("Task updated!");
    });
}

//This gets the amount of tasks from database based on a specific date
export const getTaskAmount = (db, date) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT COUNT(*) AS taskCount FROM tasks WHERE date = ?",
                [date],
                (_, { rows: { _array } }) => {
                    // console.log("gettingForDate");
                    resolve(_array[0].taskCount);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

//Logic for getting all tasks from database
export const getAllTasks = (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("SELECT id, name, description, priority, date, startTime, endTime, image, notification, tag, done FROM tasks", [], (_, { rows }) => {
                resolve(rows);
            }, (_, error) => {
                reject(error);
            });
        });
    });
};

//Logic for getting task by specific id
export const getTaskbyId = (db, id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM tasks WHERE id =?", [id], (_, { rows }) => {
                // Check if there are any rows returned
                if (rows.length > 0) {
                    // Extract the first row as an object
                    const task = rows._array[0];
                    resolve(task);
                } else {
                    resolve(null); // Resolve with null if no task found
                }
            }, (_, error) => {
                reject(error);
            });
        });
    });
};

//Logic for updating the "done" value of task
export const updateTaskDoneById = (db, id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE tasks SET done = 1 WHERE id = ?",
                [id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

//Logic for deleting task by specific id
export const deleteTaskbyId = (db, id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM tasks where id = ?",
                [id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

//Logic for deleting tasks by specific date
export const deleteTasksByDate = (db, date) => {
    console.log("delete by date")
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM tasks WHERE date < ? AND done = 1",
                [date],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        console.log("old tasks deleted")
                        resolve(true);
                    } else {
                        console.log("no old tasks")
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export default {
    db,
    createDB,
    addTask,
    deleteTask,
    updateTask,
    getAllTasks,
    getTaskAmount,
    getTaskbyId,
    updateTaskDoneById,
    deleteTaskbyId,
    deleteTasksByDate,
};
