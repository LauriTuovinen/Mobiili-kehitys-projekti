import { useState } from 'react';
import { Button, Text, TextInput, View, Image, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker'
// import DateTimePicker from 'react-native-ui-datepicker'


export default function CreateTask() {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [repeatInterval, setRepeatInterval] = useState('none');
    const [image, setImage] = useState(null);


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
                <Text>Set start and end times:</Text>
                <DatePicker
                    date={startTime}
                    mode="time"
                    format='HH:mm'
                    onDateChange={time => setStartTime(time)}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                />
                <DatePicker
                    date={endTime}
                    mode="time"
                    format='HH:mm'
                    onDateChange={time => setEndTime(time)}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                />

            </View>
        </View>
    )
}