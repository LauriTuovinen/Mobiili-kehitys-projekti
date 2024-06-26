import { View, Text, Button, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import database from "../components/database";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import * as FileSystem from 'expo-file-system';
import { useRoute } from "@react-navigation/native";
import { DarkModeContext } from "../components/themeContext";
import CreateTaskButton from "../components/CreateTaskButton";

const db = database.db;
const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

export const TaskInfo = () => {

    const { darkMode } = useContext(DarkModeContext)
    const [task, setTask] = useState(null);
    const route = useRoute()
    const { taskId } = route.params || { taskId: 1 }
    console.log(taskId);

    //Fetches task fromd atabase
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
    }, [taskId]);

    //Saves a modified version of image uri to database so that it can be fetched later
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
    <View style={darkMode ? styles.DarkContainer : styles.container}>
        <ScrollView>
            {task ? (
                <View>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <View style={darkMode ? styles.DarkTaskContainer : styles.taskContainer}>
                        <Text style={styles.label}>Info:</Text>
                        <Text style={darkMode ? styles.darkValue : styles.value}>{task.description}</Text>
                        <Text style={styles.label}>Time:</Text>
                        <Text style={darkMode ? styles.darkValue : styles.value}>{task.startTime} - {task.endTime}</Text>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={darkMode ? styles.darkValue : styles.value}>{task.date}</Text>
                        <Text style={styles.label}>Priority:</Text>
                        <Text style={darkMode ? styles.darkValue : styles.value}>{task.priority}</Text>
                        <Text style={styles.label}>Tag:</Text>
                        <Text style={darkMode ? styles.darkValue : styles.value}>{task.tag}</Text>
                        {task.image && (
                            <Image source={{ uri: task.image }} style={{ alignSelf: 'center', width: 150, height: 150, borderRadius: 10 }} />
                        )}
                        
                    </View>
                    {/* <CreateTaskButton/> */}
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: bgColorLight,
    },
    DarkContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: bgColorDark
    },
    taskName: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 20,
        marginTop: 10,

    },
    taskContainer: {
        backgroundColor: cardColorLight,
        borderRadius: 5,
        padding: 10,
        marginBottom: 150,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: 320,
    },
    DarkTaskContainer: {
        backgroundColor: cardColorDark,
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
        borderColor: navbarColorLight,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        backgroundColor: navbarColorLight,
    },

    darkValue: {
        marginBottom: 10,
        borderColor: navbarColorDark,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        backgroundColor: navbarColorDark,
    },
});