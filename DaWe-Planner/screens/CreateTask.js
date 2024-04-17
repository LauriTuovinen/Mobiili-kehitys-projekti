import { useState, useEffect, useContext, useRef } from 'react';
import { Button, Text, TextInput, View, Image, Pressable, TouchableOpacity, StyleSheet, ScrollView, Modal, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import CheckBox from 'expo-checkbox';
import database from '../components/database';
import { Card } from '@rneui/themed';
import { dropTaskTable } from '../components/database';
import * as ImagePicker from 'expo-image-picker';
import { DarkModeContext } from '../components/themeContext';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

var moment = require('moment');
const tags = ['Hobby', 'Work', 'Exercise', 'Study', 'Food', 'Chores'];
// {/* */}   comment format inside react native jsx code


export default function CreateTask() {
    
    const { darkMode } = useContext(DarkModeContext)

 
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [priority, setPriority] = useState(1); // default priority set to high
    const [repeatInterval, setRepeatInterval] = useState('none'); //not yet implemented
    const [image, setImage] = useState(null);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notification, setNotification] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [imageSourceModalVisible, setImageSourceModalVisible] = useState(false);
    const [pushNotification, setPushNotification] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [tagModalVisible, setTagModalVisible] = useState(false);

    const db = database.db;
    const notificationListener = useRef();
    const responseListener = useRef();

        //from expo docs
        useEffect(() => {
            registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
            notificationListener.current = Notifications.addNotificationReceivedListener(pushNotification => {
                setPushNotification(pushNotification);
            });
    
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });
    
            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };
        }, []);
    
        async function registerForPushNotificationsAsync() {
            let token;
    
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [1000, 1000, 1000, 1000],
                    lightColor: darkMode ? navbarColorDark : navbarColorLight,
                });
            }
    
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                console.log(token);
            } else {
                alert('Must use physical device for Push Notifications');
            }
    
            return token;
        }
    
        const scheduleNotification = async (notificationTime, taskName) => {
            //ScheduledTime is CurrentTime in millizeconds plus 3 hour timezone minus notificationTimeMilliseconds.
            const currentTime = Date.now() + (3*60*60*1000)
            const notificationTimeMilliseconds= notificationTime.getTime()
            let scheduledTime = Math.round((notificationTimeMilliseconds - currentTime) / 1000 ) // divided by 1000 to get seconds and round them
            console.log('Time left untill notification:', scheduledTime, 'seconds');
            if (scheduledTime < 0){ // If task has already gone when created, set scheduled time to 1 second to make the notification straight away.
                scheduledTime = 1
            }
            // // Schedule notification 10 minutes before task start time
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Task Reminder",
                    body: `Your task "${taskName}" is starting soon!`,
                    data: { taskName },
                },
                trigger: { 
                    seconds: scheduledTime
                 }, 

            });
        }

    const pickImage = async (source) => {
        // No permissions request is necessary for launching the image library
        let result;
        if (source === 'gallery') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const toggleTagModal = () => {
        setTagModalVisible(!tagModalVisible);
    };

    const toggleImageSourceModal = () => {
        setImageSourceModalVisible(!imageSourceModalVisible);
    };

    const selectImageSource = (source) => {
        toggleImageSourceModal();
        if (source === 'camera') {
            takePhoto();
        } else if (source === 'gallery') {
            pickImage('gallery');
        }
    };

    const takePhoto = () => {
        pickImage('camera');
    };
    
    const getTasks = async () => {
        const taskData = await database.getAllTasks(db);
        setTasks(taskData);
        console.log(tasks);
    };
    
    const handleSaveTask = async () => {
 
        const formattedDate = dayjs(date).format('DD/MM/YYYY');
        const formattedStartTime = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedEndTime = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        await database.addTask(db, taskName, description, priority, formattedDate, startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), image, notification);
       
        //send notification is notification === true
        if (notification === true) {
            const taskStartTime = moment(`${formattedDate} ${formattedStartTime}`, 'DD/MM/YYYY HH:mm').toDate(); 
            const taskStartTimeTimeZone = moment(taskStartTime).add(3, 'hours') //add 3 hours because of timezone, haxs
            const notificationTime = moment(taskStartTimeTimeZone).subtract(10, 'minutes').toDate(); // Calculate notification time 10 minutes before task start
            console.log('notificationtime: ', notificationTime);
            await scheduleNotification(notificationTime, taskName);
        }

        //console.log("Date: ", date.toISOString());
        //for now we print the data from the created task

        // console.log("Task Name: ", taskName);
        // console.log("Descriptsion: ", description);
        // console.log("Priority", priority);
        // console.log("Date: ", date.toLocaleDateString());
        // console.log("Start Time: ", startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        // console.log("End Time: ", endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        // console.log("Notification: ", notification);

    }



    const onChangeStartTime = (event, selectedTime) => {
        const currentDate = selectedTime || startTime;
        setShowStartTimePicker(false);
        setStartTime(currentDate);
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentDate = selectedTime || endTime;
        setShowEndTimePicker(false);
        setEndTime(currentDate);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={darkMode ? styles.DarkContainer : styles.container}>
            <ScrollView>
                <View>
                    <Card containerStyle={darkMode ? styles.DarkCreateTaskCard : styles.createTaskCard}>
                        <Text style={styles.font}>Create a task:</Text>
                        <TextInput
                            placeholder='Enter task title'
                            value={taskName}
                            onChangeText={text => setTaskName(text)}
                            style={darkMode ? styles.DarkInput : styles.input}
                        />
                        <Text style={styles.font}>Info:</Text>
                        <TextInput
                            placeholder='Enter Description'
                            value={description}
                            onChangeText={text => setDescription(text)}
                            style={darkMode ? styles.DarkInput : styles.input}
                        />
                        <View>
                            <Picker selectedValue={priority} onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}>
                                <Picker.Item label="High Priority" value="1" />
                                <Picker.Item label="Medium Priority" value="2" />
                                <Picker.Item label="Low Priority" value="3" />
                            </Picker>
                        </View>

                        <Text style={styles.font}>Set Date:</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text>{dayjs(date).format('DD-MM-YYYY')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                is24Hour={true}
                                display="spinner"
                                onChange={onChangeDate}
                            />
                        )}

                        <Text style={styles.font}>Set start and end times:</Text>


                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.font}>Start Time: </Text>
                            {/* instead of using a normal pressable, we are going to use TouchableOpacity since
                    it gives additional feedback to users that you have pressed the thing */}
                            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                                <Text>{dayjs(startTime).format('HH:mm')}</Text>
                            </TouchableOpacity>
                            {showStartTimePicker && (
                                <DateTimePicker
                                    value={startTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={onChangeStartTime}
                                />
                            )}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.font}>End Time: </Text>
                            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                                <Text>{dayjs(endTime).format('HH:mm')}</Text>
                            </TouchableOpacity>
                            {showEndTimePicker && (
                                <DateTimePicker
                                    value={endTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={onChangeEndTime}
                                    padding={16}
                                />
                            )}
                        </View>
                        <View>
                            {/* 
                            <Text style={styles.font}>Image:</Text>
                            <TouchableOpacity onPress={pickImage}>
                                <Button color={'#ffb8b1'} title='Select Image' onPress={pickImage} />
                                {image && <Image source={{ uri: image }} style={styles.image} />}
                            </TouchableOpacity>
                            */}

                            <Text style={styles.font}>Image:</Text>
                            <TouchableOpacity onPress={toggleImageSourceModal}>
                                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Select Image Source" onPress={toggleImageSourceModal} />
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image }} style={styles.image} />}

                        </View>
                        <View style={styles.tagContainer}>
                                <Text style={styles.font}>
                                    {selectedTag ? selectedTag : 'Give Your Task a Tag'}
                                </Text>
                            <TouchableOpacity onPress={toggleTagModal}>
                                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Select Tag" onPress={toggleTagModal} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.font}>Do you want to get notified?</Text>

                            <CheckBox marginBottom={8}
                                marginTop={8}
                                disabled={false}
                                value={notification}
                                onValueChange={(notification) => setNotification(notification)}
                            />
                        </View>
                        <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Save Task" onPress={handleSaveTask} />
                    </Card>
                </View>


                <Modal
                    visible={tagModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setTagModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={darkMode ? styles.DarkModalContent : styles.modalContent}>
                            <View style={styles.list}>
                            <FlatList style={styles.list}
                                data={tags}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[darkMode ? styles. darkTagButton : styles.tagButton, selectedTag === item && styles.selectedTagButton]}
                                        onPress={() => {
                                            setSelectedTag(item);
                                            setTagModalVisible(false);
                                        }}>
                                        <Text style={styles.tagText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item}
                            /></View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={imageSourceModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={darkMode ? styles.DarkModalContent : styles.modalContent}>
                            <TouchableOpacity style={styles.modalItem} onPress={() => selectImageSource('camera')}>
                                <Text style={styles.modalText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => selectImageSource('gallery')}>
                                <Text style={styles.modalText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={toggleImageSourceModal}>
                                <Text style={styles.modalText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColorLight,
        alignItems: 'center',
    },
    DarkContainer: {
        flex: 1,
        backgroundColor: bgColorDark,
        alignItems: 'center',
    },
    createTaskCard: {
        backgroundColor: cardColorLight,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
        width: 300,
    },
    DarkCreateTaskCard: {
        backgroundColor: cardColorDark,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
        width: 300,
    },
    font: {
        fontSize: 20,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: 'white',
        width: 200,
    },
    DarkInput: {
        backgroundColor: '#d1d1d1',
        width: 200,
    },
    image: {
        width: 200,
        height: 200,
        margin: 16,
        flex: 1,
        alignSelf: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    tagContainer: {
        marginTop: 10,
        marginBottom: 10,
        
    },
    modalContent: {
        backgroundColor: cardColorLight,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    DarkModalContent: {
        backgroundColor: cardColorDark,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalText: {
        fontSize: 18,
        fontWeight: "bold"
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
    DarkButton: {
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: navbarColorDark,
    },
    tagButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#ffb8b1',
        alignItems: 'center'
    },
    tagText: {
        fontSize: 20,
        borderRadius: 5,
    },
    selectedTagButton: {
        backgroundColor: 'lightblue',
    },
    list: {
        height: 380,
    },
    darkTagButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: navbarColorDark,
        alignItems: 'center'
    },
});