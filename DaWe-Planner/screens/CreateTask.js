import { useState, useEffect } from 'react';
import { Button, Text, TextInput, View, Image, Pressable, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import CheckBox from 'expo-checkbox';
import database from '../components/database';
import { Card } from '@rneui/themed';
import { dropTaskTable } from '../components/database';
import * as ImagePicker from 'expo-image-picker';

// {/* */}   comment format inside react native code

export default function CreateTask() {
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
    const [imageSourceModalVisible, setImageSourceModalVisible] = useState(false);

    const db = database.db;

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
        } else if(source === 'camera'){
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

        await database.addTask(db, taskName, description, priority, formattedDate, startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), image, notification);
        //getTasks();

        //console.log("Date: ", date.toISOString());
        //for now we print the data from the created task
        /*
        console.log("Task Name: ", taskName);
        console.log("Descriptsion: ", description);
        console.log("Priority", priority);
        console.log("Date: ", date.toLocaleDateString());
        console.log("Start Time: ", startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        console.log("End Time: ", endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        console.log("Notification: ", notification);
        */

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
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Card containerStyle={styles.createTaskCard}>
                        <Text style={styles.font}>Create a task:</Text>
                        <TextInput
                            placeholder='Enter task title'
                            value={taskName}
                            onChangeText={text => setTaskName(text)}
                            style={styles.input}
                        />
                        <Text style={styles.font}>Info:</Text>
                        <TextInput
                            placeholder='Enter Description'
                            value={description}
                            onChangeText={text => setDescription(text)}
                            style={styles.input}
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
                                <Button color={'#ffb8b1'} title="Select Image Source" onPress={toggleImageSourceModal} />
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                    
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
                        <Button color={'#ffb8b1'} title="Save Task" onPress={handleSaveTask} />
                    </Card>
                </View>
                
                <Modal visible={imageSourceModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
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
        backgroundColor: '#f9efdb',
        alignItems: 'center',
    },
    createTaskCard: {
        backgroundColor: '#ffdac1',
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
    modalContent: {
        backgroundColor: 'white',
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
    },
});