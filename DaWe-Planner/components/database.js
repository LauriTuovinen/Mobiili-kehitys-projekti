import * as SQLite from "expo-sqlite"
import { useState, useEffect } from 'react';

export const db = SQLite.openDatabase("DaWe.db");

//This creates a new table if table doesn't exist yet
export const createDB = (db) => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, priority INT, date TEXT NOT NULL, startTime TEXT, endTime TEXT, description TEXT, notification INT NOT NULL, tag TEXT )")
    });
    console.log("Database Created!");
}
//This is for removing tables from database

export const dropTaskTable = (db) => {
    db.transaction(tx => {
        tx.executeSql("DELETE FROM tasks")
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
export const addTask = (db, taskName, description, priority, date, startTime, endTime, notification) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO tasks (name, description, priority, date, startTime, endTime, notification, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [taskName, description, priority, date, startTime, endTime, notification, ''],
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

export const getTaskAmount = (db, date) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT COUNT(*) AS taskCount FROM tasks WHERE date = ?",
                [date],
                (_, { rows: { _array } }) => {
                    console.log("gettingForDate");
                    resolve(_array[0].taskCount);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const getAllTasks = (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("SELECT id, name, description, priority, date, startTime, endTime, notification, tag FROM tasks", [], (_, { rows }) => {
                resolve(rows);
            }, (_, error) => {
                reject(error);
            });
        });
    });
};

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

export default {
    db,
    createDB,
    addTask,
    deleteTask,
    updateTask,
    getAllTasks,
    getTaskAmount,
    getTaskbyId,
  };
