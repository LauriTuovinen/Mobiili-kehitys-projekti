import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Image } from '@rneui/themed';
import hyi from '../assets/hyi.jpg'
import database from "../components/database";
import { useFocusEffect } from '@react-navigation/native';
import { useRoute, useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { Button } from '@rneui/themed';
import CreateTaskButton from '../components/CreateTaskButton';
import { DarkModeContext } from '../components/themeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';


const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

var moment = require('moment')
const db = database.db;


const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionPress = (option) => {
      // Do something with the selected option
      console.log('Selected option:', option);
      // Close the dropdown after selecting an option
      setIsOpen(false);
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
        {isOpen && (
          <View style={[styles.dropdownContent, styles.dropdownOnTop]}>
            <TouchableOpacity onPress={() => handleOptionPress('Option 1')} style={styles.optionButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionPress('Option 2')} style={styles.optionButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


function Home() {
    const { darkMode } = useContext(DarkModeContext)
    const [tasks, setTasks] = useState([]);
    const [openPhotos, setOpenPhotos] = useState(Array(tasks.length).fill(false)); // State to track modal open status
    const route = useRoute();
    const navigation = useNavigation();
    const { correctDay } = route.params || moment();
    const currentDay = moment().format('DD/MM/YYYY');
    const formattedDay = moment(correctDay).format('DD/MM/YYYY');

    console.log(currentDay);

    const fetchData = async () => {
        try {
            //await database.deleteTasksByDate(db, currentDay);
            const taskData = await database.getAllTasks(db);

            const newTasks = taskData._array.filter(task => {
                const taskDate = moment(task.date, 'DD/MM/YYYY');
                if (formattedDay === currentDay) {
                    return taskDate.isSameOrBefore(correctDay, 'day');
                }
                else {
                    return taskDate.isSame(correctDay, 'day');
                }

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
    const updateDone = async (id) => {
        database.updateTaskDoneById(db, id);

        fetchData();
    }
    const deleteTask = async (id) => {
        database.deleteTaskbyId(db, id);

        fetchData();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={{ backgroundColor: bgColorLight }} />
            <ScrollView>
                <Text style={styles.header}>Upcoming tasks</Text>
                <Text style={styles.secondadryHeader}>{formattedDay}</Text>
                <View style={styles.upcomingTaskView}>
                    {tasks.map((t, i) => {
                        const cardStyles = t.done === 1 ? styles.dullCard : styles.upcomingTaskCard;
                        return (
                            <TouchableOpacity key={i} onPress={() => navigateToTaskInfo(t.id)}>
                                {/* Mapping tasks to cards */}
                                <Card containerStyle={styles.upcomingTaskCard}>
                                    <Card.Title style={styles.font}>{t.name}
                                    <View style={styles.dropdownContainer}>
                                        <DropdownMenu/>
                                    </View>
                                    </Card.Title>
                                    <Card.Divider />
                                    {/* <Text style={{ paddingLeft: 13, paddingBottom: 5 }}>{t.date}</Text> */}
                                    <View style={{ flex: 1, flexDirection: 'row', }}>
                                        <View style={{ flex: 1, flexDirection: 'column', }}>
                                            <Text style={{ flex: 1, padding: 8, maxHeight: 118 }}>{t.description}</Text>
                                            <Text style={{ flex: 1, paddingLeft: 8, color: '#5c5c5c' }}>{t.startTime} - {t.endTime}</Text>
                                        </View>
                                                <Image
                                                    source={{ uri: t.image }} // t.image is the URI
                                                    style={{ width: 120, height: 120, borderRadius: 10, }}
                                                    onPress={() => handleOpenPhoto(i)} // Open modal on press
                                                />
                                        </View>
                                        {/* Conditionally render the PhotoModal */}
                                        {openPhotos[i] && <PhotoModal ImageSource={{ uri: t.image }} index={i} />}
                                
                                    </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            <CreateTaskButton />
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
    DarkContainer: {
        flex: 1,
        backgroundColor: bgColorDark,
        width: '100%',
    },
    header: {
        alignSelf: 'center',
        marginTop: 24,
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
        width: '100%',
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
        marginBottom: 16,
    },
    dullCard: {
        opacity: 0.5,
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
        paddingLeft: 16,

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
    font: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'black'
    },
    dropdownContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 999, // Ensure dropdown is on top of everything
        alignItems: 'flex-end',
      },
    dropdownButton: {
        backgroundColor: '#ffdac1',
      },
      dropdownContent: {
        position: 'absolute',
        top: 40,
        left: 0,
        backgroundColor: '#ffb8b1',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        elevation: 5,
      },
      optionButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      buttonText: {
        color: 'black',
        textAlign: 'center',
      },
});

export default Home;