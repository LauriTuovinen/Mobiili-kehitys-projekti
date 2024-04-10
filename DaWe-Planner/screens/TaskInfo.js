import { View, Text, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import database from "../components/database";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import * as FileSystem from 'expo-file-system';

const db = database.db;
const modifyUri = (uri) => {
  
    if (uri.startsWith('file://')) {
      
      return uri.replace('file://', 'asset://');
    } else {
      
      return uri;
    }
  };

  export const TaskInfo = ({ id }) => {
    const taskId = id || 3;
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskByID(taskId);
                if (fetchedTask.image) {
                    await copyImageToLocalDirectory(fetchedTask.image);
                }
                setTask(fetchedTask);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [id]);

    const copyImageToLocalDirectory = async (imageUri) => {
        try {
            const fileName = imageUri.split('/').pop();
            const localUri = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.copyAsync({ from: imageUri, to: localUri });
            setTask((prevTask) => ({
                ...prevTask,
                image: localUri, 
            }));
        } catch (error) {
            console.error('Error copying image:', error);
        }
    };

    const getTaskByID = async (id) => {
        const task = await database.getTaskbyId(db, id);
        return task;
    };

    // Render the component
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
                        {task.image && (
                            <Image source={{ uri: task.image }} style={{ width: 120, height: 120 }} />
                        )}
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
        width: 320,
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