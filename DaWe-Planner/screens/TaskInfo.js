import { View, Text, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import database from "../components/database";
import { StyleSheet } from "react-native";

const db = database.db;

export const TaskInfo = ({ id }) => {
    const taskId = id || 6;
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskByID(taskId);
                setTask(fetchedTask);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [id]);

    const getTaskByID = async (id) => {
        const task = await database.getTaskbyId(db, id);
        return task;
    };

    return (
        <View style={styles.container}>
            {task ? (
                <View>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <View style={styles.taskContainer}>
                        <Text style={styles.label}>Info:</Text>
                        <Text style={styles.value}>{task.description}</Text>
                        <Text style={styles.label}>Time:</Text>
                        <Text style={styles.value}>{task.startTime} - {task.endTime}</Text>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>{task.date}</Text>
                        <Text style={styles.label}>Priority:</Text>
                        <Text style={styles.value}>{task.priority}</Text>
                    </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f9efdb"
    },
    taskName: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 20,


    },
    taskContainer: {
        backgroundColor: '#ffdac1',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 150,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 20
    },
    value: {
        marginBottom: 10,
    },
});