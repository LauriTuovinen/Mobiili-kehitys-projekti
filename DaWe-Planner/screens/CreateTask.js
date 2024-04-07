import { useState, useEffect } from 'react';
import { Button, Text, TextInput, View, Image, Pressable, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import CheckBox from 'expo-checkbox';
import database from '../components/database';

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

    const db = database.db;



    const getTasks = async () => {
        const taskData = await database.getAllTasks(db);
        setTasks(taskData);
        console.log(taskData);
    };
    // Empty dependency array [] ensures it runs only on mount


    const handleSaveTask = () => {
        database.addTask(db, taskName, description, priority, date, startTime, endTime, notification, "");
        getTasks();
        //for now we print the data from the created task
        /*
        console.log("Task Name: ", taskName);
        console.log("Description: ", description);
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
        <View>
            <Text>Create task screen</Text>
            <View>
                <Text>Create a task:</Text>
                <TextInput
                    placeholder='Enter task title'
                    value={taskName}
                    onChangeText={text => setTaskName(text)}
                />
                <Text>Info:</Text>
                <TextInput
                    placeholder='Enter Description'
                    value={description}
                    onChangeText={text => setDescription(text)}
                />
                <View>
                    <Picker selectedValue={priority} onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}>
                        <Picker.Item label="High Priority" value="1" />
                        <Picker.Item label="Medium Priority" value="2" />
                        <Picker.Item label="Low Priority" value="3" />
                    </Picker>
                </View>

                <Text>Set Date:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text>{dayjs(date).format('YYYY-MM-DD')}</Text>
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

                <Text>Set start and end times:</Text>


                <View style={{ flexDirection: 'column' }}>
                    <Text>Start Time: </Text>
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
                    <Text>End Time: </Text>
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
                        />
                    )}
                </View>
                <View>
                    <Text>Do you want to get notified?</Text>

                    <CheckBox
                        disabled={false}
                        value={notification}
                        onValueChange={(notification) => setNotification(notification)}
                    />
                </View>
                <Button title="Save Task" onPress={handleSaveTask} />
            </View>



        </View>

    )
}