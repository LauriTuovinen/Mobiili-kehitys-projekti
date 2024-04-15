import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Image } from '@rneui/themed';
import hyi from '../assets/hyi.jpg'
import database from "../components/database";
import { useFocusEffect } from '@react-navigation/native';
import { useRoute, useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { Button } from '@rneui/themed';


const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'

var moment = require('moment')
const db = database.db;
function Home() {
    const [tasks, setTasks] = useState([]);
    const [openPhotos, setOpenPhotos] = useState(Array(tasks.length).fill(false)); // State to track modal open status
    const route = useRoute();
    const navigation = useNavigation();
    const { correctDay } = route.params || moment();

    const formattedDay = moment(correctDay).format('DD/MM/YYYY');

    const fetchData = async () => {
        try {
            const taskData = await database.getAllTasks(db);

            const newTasks = taskData._array.filter(task => {
                const taskDate = moment(task.date, 'DD/MM/YYYY');
                return taskDate.isSame(correctDay, 'day');
            });

            const tasksWithModifiedImages = await Promise.all(newTasks.map(async task => {
                if (task.image) {
                    const localUri = await copyImageToLocalDirectory(task.image);
                    task.image = localUri;
                }
                return task;
            }));

            setTasks(tasksWithModifiedImages);
            setOpenPhotos(Array(tasksWithModifiedImages.length).fill(false));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
        }, [correctDay])
    )

    const copyImageToLocalDirectory = async (imageUri) => {
        try {
            const fileName = imageUri.split('/').pop();
            const localUri = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.copyAsync({ from: imageUri, to: localUri });
            return localUri;
        } catch (error) {
            console.error('Error copying image:', error);
            return null;
        }
    };

    const handleClosePhoto = (index) => {
        setOpenPhotos(prevState => {
            const newState = [...prevState];
            newState[index] = false;
            return newState;
        });
    };

    const handleOpenPhoto = (index) => {
        setOpenPhotos(prevState => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });
    };

    function OwnButton(props) {
        const { onPress, title = 'Save' } = props;
        return (
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </Pressable>
        );
    }

    function PhotoModal({ ImageSource, index }) {
        const isOpen = openPhotos[index];

        return (
            <Modal
                visible={isOpen}
                transparent={true}
                animationType='fade'
                onRequestClose={() => handleClosePhoto(index)}
            >
                <View style={styles.imageModal}>
                    <View style={styles.viewModal}>
                        <Image
                            source={ImageSource}
                            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                        />
                        <OwnButton title="close" onPress={() => handleClosePhoto(index)} color={navbarColorLight} />
                    </View>
                </View>
            </Modal>
        );
    }

    // Navigate to task info based on id
    const navigateToTaskInfo = (id) => {
        navigation.navigate('TaskInfo', { taskId: id });
        console.log('Navigate to task id:', id);
    };
    const handlePress = (id) => { 
        database.updateTaskDoneById(db, id);
        console.log("Tate of done change for id: ", {id})
    }
    const deleteTask = (id) => {
        database.deleteTaskbyId(db, id);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={{ backgroundColor: bgColorLight }} />
            <ScrollView>
                <Text style={styles.header}>Upcoming tasks</Text>
                <Text style={styles.secondadryHeader}>{formattedDay}</Text>
                <View style={styles.upcomingTaskView}>
                    {tasks.map((t, i) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => navigateToTaskInfo(t.id)}>
                                {/* Mapping tasks to cards */}
                                <Card containerStyle={styles.upcomingTaskCard}>
                                    <Card.Title>{t.name}</Card.Title>
                                    <Card.Divider />
                                    {/* <Text style={{ paddingLeft: 13, paddingBottom: 5 }}>{t.date}</Text> */}
                                    <Text style={{ flex: 1, overflow: 'hidden', paddingLeft: 13 }}>Starting at {t.startTime}</Text>
                                    <Text style={{ flex: 1, overflow: 'hidden', paddingLeft: 13 }}>Ends at {t.endTime}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Image
                                            source={{ uri: t.image }} // Assuming t.image is the URI
                                            style={{ width: 120, height: 120, borderRadius: 10 }}
                                            onPress={() => handleOpenPhoto(i)} // Open modal on press
                                        />
                                        <Text style={{ flex: 1, overflow: 'hidden' }}>{t.description}</Text>
                                        <Text style={{ flex: 1, overflow: 'hidden' }}>{t.notification}</Text>
                                        <Text style={{ flex: 1, overflow: 'hidden' }}>{t.priority}</Text>
                                        <Button onPress={() => handlePress(t.id)} title="done"></Button>
                                        <Button onPress={() => deleteTask(t.id)} title="delete"></Button>
                                    </View>
                                    {/* Conditionally render the PhotoModal */}
                                    {openPhotos[i] && <PhotoModal ImageSource={{ uri: t.image }} index={i} />}
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


//styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColorLight,
        width: '100%',
    },
    header: {
        alignSelf: 'flex-end',
        marginRight: 25,
        marginTop: 70,
        fontWeight: 'bold',
        fontSize: 40,
    },
    secondadryHeader: {
        alignSelf: 'flex-start',
        marginLeft: 55,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    upcomingTaskView: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 20,
    },
    upcomingTaskCard: {
        backgroundColor: cardColorLight,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
    },
    image: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        marginTop: 5,

    },
    imageModal: {
        flex: 1,
        flexDirection: 'column',
        height: '90%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModal: {
        width: '70%',
        height: '70%',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: navbarColorLight,
    },
});




export default Home;